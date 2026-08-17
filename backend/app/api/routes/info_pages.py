from uuid import UUID
from typing import Any, cast
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import col, func, select

from app.core.config import settings
from app.api.deps import CurrentUser, SessionDep, \
    parse_info_page_create, parse_info_page_update
from app.models import InfoPage, InfoPageCreate, InfoPageUpdate, \
    InfoPageImageType, InfoPageImage, InfoPagePublic, InfoPagesPublic, \
    InfoPageMenuItemPublic, InfoPageMenuItemsPublic, Message
from app.utils import save_image_to_local, delete_image_from_local


router = APIRouter(prefix="/info-pages", tags=["info-pages"])


@router.get("/", response_model=InfoPagesPublic)
def read_info_pages(
  session: SessionDep,
  skip: int = 0,
  limit: int = 100
) -> InfoPagesPublic:
    """
    Retrieve info pages.
    """

    count_statement = select(func.count()).select_from(InfoPage)
    count = session.exec(count_statement).one()
    
    statement = (
        select(InfoPage)
        .order_by(col(InfoPage.created_at).desc())
        .offset(skip)
        .limit(limit)
    )
    info_pages = session.exec(statement).all()

    info_pages_public = [InfoPagePublic.model_validate(info_page) for info_page in info_pages]
    return InfoPagesPublic(data=info_pages_public, count=count)

@router.get("/menu-item", response_model=InfoPageMenuItemsPublic)
def read_info_page_menu_items(
  session: SessionDep,
  skip: int = 0,
  limit: int = 100
) -> InfoPageMenuItemsPublic:
    """
    Retrieve info page menu items.
    """

    count_statement = select(func.count()).select_from(InfoPage)
    count = session.exec(count_statement).one()
    
    statement = (
        select(
            InfoPage.id,
            InfoPage.created_at,
            InfoPage.owner_id,
            InfoPage.title
        )
        .order_by(col(InfoPage.created_at).desc())
        .offset(skip)
        .limit(limit)
    )
    items = session.exec(statement).all()

    info_pages_menu_items_public = [InfoPageMenuItemPublic.model_validate(item) for item in items]
    return InfoPageMenuItemsPublic(data=info_pages_menu_items_public, count=count)


@router.get("/{id}", response_model=InfoPagePublic)
def read_info_page(session: SessionDep, id: UUID) -> Any:
    """
    Get info page by ID.
    """
    info_page = session.get(InfoPage, id)
    if not info_page:
        raise HTTPException(status_code=404, detail="InfoPage not found")
    return info_page


@router.post("/", response_model=InfoPagePublic)
def create_info_page(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    info_page_in: InfoPageCreate = Depends(parse_info_page_create),
) -> Any:
    """
    Create new info page.
    """
    info_page = InfoPage.model_validate(
        info_page_in.model_dump(
            exclude={"banner_image", "block_1_image", "block_2_image"}
        ),
        update={"owner_id": current_user.id}
    )
    
    banner_image_url = save_image_to_local(
        info_page_in.banner_image,
        settings.INFO_PAGE_IMAGES_DIR
    )
    banner_image = InfoPageImage(
        url=banner_image_url,
        info_page_id=info_page.id,
        type=InfoPageImageType.banner,
        alt_text=f"{info_page.title} info page banner image",
    )
    session.add(banner_image)
    info_page.images.append(banner_image)
    
    if info_page_in.block_1_image:
        block_1_image_url = save_image_to_local(
            info_page_in.block_1_image,
            settings.INFO_PAGE_IMAGES_DIR
        )
        block_1_image = InfoPageImage(
            url=block_1_image_url,
            info_page_id=info_page.id,
            type=InfoPageImageType.block_1,
            alt_text=f"{info_page.title} info page block 1 image",
        )
        session.add(block_1_image)
        info_page.images.append(block_1_image)
        
    if info_page_in.block_2_image:
        block_2_image_url = save_image_to_local(
            info_page_in.block_2_image,
            settings.INFO_PAGE_IMAGES_DIR
        )
        block_2_image = InfoPageImage(
            url=block_2_image_url,
            info_page_id=info_page.id,
            type=InfoPageImageType.block_2,
            alt_text=f"{info_page.title} info page block 2 image",
        )
        session.add(block_2_image)
        info_page.images.append(block_2_image)
        
    session.add(info_page)
    
    session.commit()
    session.refresh(info_page)
    return info_page


@router.put("/{id}", response_model=InfoPagePublic)
def update_info_page(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: UUID,
    info_page_in: InfoPageUpdate = Depends(parse_info_page_update),
) -> Any:
    """
    Update a info_page.
    """
    info_page = session.get(InfoPage, id)
    if not info_page:
        raise HTTPException(status_code=404, detail="InfoPage not found")
    if not current_user.is_superuser and (info_page.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    info_page.sqlmodel_update(
        info_page_in.model_dump(
            exclude_unset=True,
            exclude_none=True,
            exclude={"banner_image", "block_1_image", "block_2_image"}
        )
    ) 
    
    images = {image.type: image for image in info_page.images}
    
    for index, image_type in enumerate(InfoPageImageType, start=1):
        uploaded = getattr(info_page_in, f"{image_type.value}_image")
        if uploaded is None:
            continue
        
        image = images.setdefault(
            image_type,
            InfoPageImage(
                info_page_id=info_page.id,
                type=image_type,
                url="",
            ),
        )
        
        if image not in info_page.images:
            info_page.images.append(image)
        elif image.url:
            delete_image_from_local(image.url)
        
        image.url = save_image_to_local(
            uploaded,
            settings.INFO_PAGE_IMAGES_DIR,
        )
        image.alt_text = f"{info_page.title} info page block {index} image"
        
    session.add(info_page)
    session.commit()
    session.refresh(info_page)
    return info_page


@router.delete("/{id}")
def delete_info_page(
    session: SessionDep,
    current_user: CurrentUser,
    id: UUID
) -> Message:
    """
    Delete a info_page.
    """
    info_page = session.get(InfoPage, id)
    if not info_page:
        raise HTTPException(status_code=404, detail="InfoPage not found")
    if not current_user.is_superuser and (info_page.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    info_page_image_keys = ["banner_image", "block_1_image", "block_2_image"]
    
    for key in info_page_image_keys:
        info_page_image = cast(InfoPageImage | None, getattr(info_page, key)) 
        
        if info_page_image:
            delete_image_from_local(info_page_image.url)

    session.delete(info_page)
    session.commit()
    return Message(message="InfoPage deleted successfully")


