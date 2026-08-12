from uuid import UUID
from typing import Any, cast
from fastapi import APIRouter, HTTPException, Depends, Form, Query
from sqlmodel import col, func, select

from app.core.config import settings
from app.api.deps import CurrentUser, SessionDep, \
    parse_destination_create, parse_destination_update
from app.models import Destination, DestinationCreate, DestinationUpdate, \
    DestinationImageType, DestinationImage, DestinationPublic, DestinationsPublic, \
    Message
from app.utils import save_image_to_local, delete_image_from_local


router = APIRouter(prefix="/destinations", tags=["destinations"])


@router.get("/", response_model=DestinationsPublic)
def read_destinations(
  session: SessionDep,
  skip: int = 0,
  limit: int = 100
) -> DestinationsPublic:
    """
    Retrieve destinations.
    """
    count_statement = select(func.count()).select_from(Destination)
    count = session.exec(count_statement).one()
    statement = (
        select(Destination)
        .order_by(col(Destination.created_at).desc())
        .offset(skip)
        .limit(limit)
    )
    destinations = session.exec(statement).all()

    destinations_public = [DestinationPublic.model_validate(destination) for destination in destinations]
    return DestinationsPublic(data=destinations_public, count=count)


@router.get("/{id}", response_model=DestinationPublic)
def read_destination(session: SessionDep, id: UUID) -> Any:
    """
    Get destination by ID.
    """
    destination = session.get(Destination, id)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return destination


@router.post("/", response_model=DestinationPublic)
def create_destination(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    destination_in: DestinationCreate = Depends(parse_destination_create),
) -> Any:
    """
    Create new destination.
    """
    destination = Destination.model_validate(
        destination_in.model_dump(exclude={"banner_image", "side_image"}),
        update={"owner_id": current_user.id}
    )
    
    banner_image_url = save_image_to_local(
        destination_in.banner_image,
        settings.DESTINATION_IMAGES_DIR
    )
    banner_image = DestinationImage(
        url=banner_image_url,
        destination_id=destination.id,
        type=DestinationImageType.banner,
        alt_text=f"Destination banner image - {destination.destination}/{destination.country}/{destination.region}",
    )
    session.add(banner_image)
    destination.images.append(banner_image)
    
    if destination_in.side_image:
        side_image_url = save_image_to_local(
            destination_in.side_image,
            settings.DESTINATION_IMAGES_DIR
        )
        side_image = DestinationImage(
            url=side_image_url,
            destination_id=destination.id,
            type=DestinationImageType.side,
            alt_text=f"Destination side image - {destination.destination}/{destination.country}/{destination.region}",
        )
        session.add(side_image)
        destination.images.append(side_image)
        
    session.add(destination)
    
    session.commit()
    session.refresh(destination)
    return destination


@router.put("/{id}", response_model=DestinationPublic)
def update_destination(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: UUID,
    destination_in: DestinationUpdate = Depends(parse_destination_update),
) -> Any:
    """
    Update a destination.
    """
    destination = session.get(Destination, id)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    if not current_user.is_superuser and (destination.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    destination.sqlmodel_update(
        destination_in.model_dump(
            exclude_unset=True,
            exclude_none=True,
            exclude={"banner_image", "side_image"}
        )
    ) 
    
    images = {image.type: image for image in destination.images}
    
    for image_type in DestinationImageType:
        uploaded = getattr(destination_in, f"{image_type.value}_image")
        if uploaded is None:
            continue
        
        image = images.setdefault(
            image_type,
            DestinationImage(
                destination_id=destination.id,
                type=image_type,
                url="",
            ),
        )
        
        if image not in destination.images:
            destination.images.append(image)
        elif image.url:
            delete_image_from_local(image.url)
        
        image.url = save_image_to_local(
            uploaded,
            settings.DESTINATION_IMAGES_DIR,
        )
        image.alt_text = (
            f"Destination {image_type.value} image - "
            f"{destination.destination}/"
            f"{destination.country}/"
            f"{destination.region}"
        )
        
    session.add(destination)
    session.commit()
    session.refresh(destination)
    return destination


@router.delete("/{id}")
def delete_destination(
    session: SessionDep, current_user: CurrentUser, id: UUID
) -> Message:
    """
    Delete a destination.
    """
    destination = session.get(Destination, id)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    if not current_user.is_superuser and (destination.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    destination_image_keys = ["banner_image", "side_image"]
    
    for key in destination_image_keys:
        destination_image = cast(DestinationImage | None, getattr(destination, key)) 
        
        if destination_image:
            delete_image_from_local(destination_image.url)

    session.delete(destination)
    session.commit()
    return Message(message="Destination deleted successfully")


