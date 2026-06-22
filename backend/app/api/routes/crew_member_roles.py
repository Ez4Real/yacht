import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import col, func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import CrewMemberRole, CrewMemberRoleCreate, CrewMemberRoleUpdate, CrewMemberRolePublic, CrewMemberRolesPublic, Message

router = APIRouter(prefix="/crew-member-roles", tags=["crew member roles"])


@router.get("/", response_model=CrewMemberRolesPublic)
def read_crew_member_roles(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> CrewMemberRolesPublic:
    """
    Retrieve crew_member_roles.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(CrewMemberRole)
        count = session.exec(count_statement).one()
        statement = (
            select(CrewMemberRole).order_by(col(CrewMemberRole.created_at).desc()).offset(skip).limit(limit)
        )
        crew_member_roles = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(CrewMemberRole)
            .where(CrewMemberRole.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(CrewMemberRole)
            .where(CrewMemberRole.owner_id == current_user.id)
            .order_by(col(CrewMemberRole.created_at).desc())
            .offset(skip)
            .limit(limit)
        )
        crew_member_roles = session.exec(statement).all()

    crew_member_roles_public = [CrewMemberRolePublic.model_validate(crew_member_role) for crew_member_role in crew_member_roles]
    return CrewMemberRolesPublic(data=crew_member_roles_public, count=count)


@router.get("/{id}", response_model=CrewMemberRolePublic)
def read_crew_member_role(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get crew member role by ID.
    """
    crew_member_role = session.get(CrewMemberRole, id)
    if not crew_member_role:
        raise HTTPException(status_code=404, detail="Crew member role not found")
    if not current_user.is_superuser and (crew_member_role.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crew_member_role


@router.post("/", response_model=CrewMemberRolePublic)
def create_crew_member_role(
    *, session: SessionDep, current_user: CurrentUser, crew_member_role_in: CrewMemberRoleCreate
) -> Any:
    """
    Create new crew member role.
    """
    crew_member_role = CrewMemberRole.model_validate(crew_member_role_in, update={"owner_id": current_user.id})
    session.add(crew_member_role)
    session.commit()
    session.refresh(crew_member_role)
    return crew_member_role


@router.put("/{id}", response_model=CrewMemberRolePublic)
def update_crew_member_role(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    crew_member_role_in: CrewMemberRoleUpdate,
) -> Any:
    """
    Update a crew member role.
    """
    crew_member_role = session.get(CrewMemberRole, id)
    if not crew_member_role:
        raise HTTPException(status_code=404, detail="Crew member role not found")
    if not current_user.is_superuser and (crew_member_role.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    update_dict = crew_member_role_in.model_dump(exclude_unset=True)
    crew_member_role.sqlmodel_update(update_dict)
    session.add(crew_member_role)
    session.commit()
    session.refresh(crew_member_role)
    return crew_member_role


@router.delete("/{id}")
def delete_crew_member_role(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete a crew member role.
    """
    crew_member_role = session.get(CrewMemberRole, id)
    if not crew_member_role:
        raise HTTPException(status_code=404, detail="Crew member role not found")
    if not current_user.is_superuser and (crew_member_role.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    session.delete(crew_member_role)
    session.commit()
    return Message(message="Crew member role deleted successfully")
