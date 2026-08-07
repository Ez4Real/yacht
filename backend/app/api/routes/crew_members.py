from uuid import UUID
from typing import Any
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import col, func, select

from app.core.config import settings
from app.api.deps import CurrentUser, SessionDep, parse_crew_member_create, \
  parse_crew_member_update
from app.models import CrewMember, CrewMemberCreate, CrewMemberUpdate, \
    CrewMemberImage, CrewMemberPublic, CrewMembersPublic, Message, \
    CrewMemberDetail, CrewMemberNavigation
from app.utils import save_image_to_local, delete_image_from_local


router = APIRouter(prefix="/crew-members", tags=["crew members"])


@router.get("/", response_model=CrewMembersPublic)
def read_crew_members(
  session: SessionDep,
  skip: int = 0,
  limit: int = 100
) -> CrewMembersPublic:
    """
    Retrieve crew members.
    """
    count_statement = select(func.count()).select_from(CrewMember)
    count = session.exec(count_statement).one()
    statement = (
        select(CrewMember).order_by(col(CrewMember.created_at).desc()).offset(skip).limit(limit)
    )
    crew_members = session.exec(statement).all()

    crew_members_public = [CrewMemberPublic.model_validate(member) for member in crew_members]
    return CrewMembersPublic(data=crew_members_public, count=count)


@router.get("/{id}", response_model=CrewMemberDetail)
def read_crew_member(
    session: SessionDep,
    id: UUID
) -> Any:
    """
    Get crew member by ID with navigation metadata.
    """
    crew_member = session.get(CrewMember, id)
    
    if not crew_member:
        raise HTTPException(status_code=404, detail="Crew member not found")

    statement = (
        select(CrewMember)
        .where(CrewMember.order < crew_member.order)
        .order_by(col(CrewMember.order).desc())
        .limit(1)
    )
    previous_member = session.exec(statement).first()
    
    statement = (
        select(CrewMember)
        .where(CrewMember.order > crew_member.order)
        .order_by(col(CrewMember.order).asc())
        .limit(1)
    )
    next_member = session.exec(statement).first()
    
    statement = (
        select(CrewMember)
        .order_by(col(CrewMember.order).desc())
        .limit(1)
    )
    if previous_member is None:
        previous_member = session.exec(statement).first()
    
    statement = (
        select(CrewMember)
        .order_by(col(CrewMember.order).asc())
        .limit(1)
    )
    if next_member is None:
        next_member = session.exec(statement).first()
    
    count_statement = select(func.count()).select_from(CrewMember)
    total = session.exec(count_statement).one()
    
    position_statement = (
        select(func.count())
        .select_from(CrewMember)
        .where(CrewMember.order <= crew_member.order)
    )
    position = session.exec(position_statement).one()
    
    if previous_member is None or next_member is None:
        raise HTTPException(
            status_code=500,
            detail="Navigation could not be determined."
        )
    
    navigation = CrewMemberNavigation(
        previous=previous_member.id,
        next=next_member.id,
        position=position,
        total=total
    )
    
    crew_member_public = CrewMemberPublic.model_validate(crew_member)
    return CrewMemberDetail(
        member=crew_member_public,
        navigation=navigation,
    )


@router.post("/", response_model=CrewMemberPublic)
def create_crew_member(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    crew_member_in: CrewMemberCreate = Depends(parse_crew_member_create),
) -> Any:
    """
    Create new crew member.
    """
    max_order_statement = (
        select(func.max(CrewMember.order))
        .select_from(CrewMember)
    )
    max_order = session.exec(max_order_statement).one()
    next_order = (max_order or 0) + 1

    crew_member = CrewMember.model_validate(
        crew_member_in.model_dump(exclude={"image"}),
        update={
            "owner_id": current_user.id,
            "order": next_order
        }
    )
    
    image_url = save_image_to_local(
        crew_member_in.image,
        settings.CREW_MEMBER_IMAGES_DIR
    )
    crew_member_image = CrewMemberImage(
        url=image_url,
        alt_text=f"Crew member - {crew_member.first_name} {crew_member.last_name}",
        crew_member_id=crew_member.id
    )
    session.add(crew_member_image)
    
    crew_member.image = crew_member_image
    session.add(crew_member)
    
    session.commit()
    session.refresh(crew_member)
    return crew_member


@router.put("/{id}", response_model=CrewMemberPublic)
def update_crew_member(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: UUID,
    crew_member_in: CrewMemberUpdate = Depends(parse_crew_member_update),
) -> Any:
    """
    Update a crew member.
    """
    crew_member = session.get(CrewMember, id)
    if not crew_member:
        raise HTTPException(status_code=404, detail="Crew member not found")
    if not current_user.is_superuser and (crew_member.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_dict = crew_member_in.model_dump(
        exclude_unset=True,
        exclude_none=True,
        exclude={"image"}
    )
    crew_member.sqlmodel_update(update_dict)
    
    if crew_member_in.image:
        old_image = crew_member.image
        if old_image:
            delete_image_from_local(old_image.url)
            session.delete(old_image)
        
        image_url = save_image_to_local(
            crew_member_in.image, settings.CREW_MEMBER_IMAGES_DIR
        )
        new_crew_member_image = CrewMemberImage(
            url=image_url,
            alt_text=f"Crew member - {crew_member.first_name} {crew_member.last_name}",
            crew_member_id=crew_member.id
        )
        session.add(new_crew_member_image)
        
    session.add(crew_member)
    session.commit()
    session.refresh(crew_member)
    return crew_member


@router.delete("/{id}")
def delete_crew_member(
    session: SessionDep, current_user: CurrentUser, id: UUID
) -> Message:
    """
    Delete a crew member.
    """
    crew_member = session.get(CrewMember, id)
    if not crew_member:
        raise HTTPException(status_code=404, detail="Crew member not found")
    if not current_user.is_superuser and (crew_member.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    if crew_member.image:
        delete_image_from_local(crew_member.image.url)

    session.delete(crew_member)
    session.commit()
    return Message(message="Crew member deleted successfully")
