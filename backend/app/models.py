import uuid
from datetime import datetime, timezone

from typing import Annotated
from pydantic import EmailStr, StringConstraints
from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel

from fastapi import UploadFile, File


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


HexColor = Annotated[str, StringConstraints(pattern=r"^#[0-9A-Fa-f]{6}$")]

# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore[assignment]
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    crew_member_roles: list["CrewMemberRole"] = Relationship(back_populates="owner", cascade_delete=True)
    crew_members: list["CrewMember"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int
    

class ImageBase(SQLModel):
    url: str
    alt_text: str | None = None

class ImageCreate(ImageBase):
    pass

class ImageUpdate(ImageBase):
    id: uuid.UUID


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore[assignment]


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


#----Crew Member Role-----

class CrewMemberRoleBase(SQLModel):
    name: str = Field(min_length=1, max_length=255)

class CrewMemberRoleCreate(CrewMemberRoleBase): pass

class CrewMemberRoleUpdate(CrewMemberRoleBase):
    name: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore[assignment]

class CrewMemberRole(CrewMemberRoleBase, table=True):
    __tablename__ = "crew_member_role" # type: ignore
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    crew_members: list["CrewMember"] = Relationship(
        back_populates="role",
        cascade_delete=False
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="crew_member_roles")

class CrewMemberRolePublic(CrewMemberRoleBase):
    id: uuid.UUID

class CrewMemberRolesPublic(SQLModel):
    data: list[CrewMemberRolePublic]
    count: int
#-------------------------


#-----Crew Member-----
class CrewMemberImage(ImageBase, table=True):
    __tablename__ = "crew_member_image" # type: ignore

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    crew_member_id: uuid.UUID = Field(
        foreign_key="crew_member.id"
    )
    crew_member: "CrewMember" = Relationship(back_populates="image")
    

class CrewMemberBase(SQLModel):
    first_name: str = Field(min_length=1, max_length=64)
    last_name: str = Field(min_length=1, max_length=64)
    background: str = Field(min_length=1, max_length=512)
    role_id: uuid.UUID
    color: HexColor
    motto: str = Field(min_length=1, max_length=510)
    instagram: str = Field(unique=True, index=True, min_length=1, max_length=30)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    
class CrewMemberCreate(CrewMemberBase):
    image: UploadFile

class CrewMemberUpdate(CrewMemberBase):
    first_name: str | None = Field(default=None, min_length=1, max_length=64) # type: ignore[assignment]
    last_name: str | None = Field(default=None, min_length=1, max_length=64) # type: ignore[assignment]
    background: str = Field(default=None, min_length=1, max_length=512)
    role_id: uuid.UUID | None = Field(default=None) # type: ignore[assignment]
    color: HexColor | None = Field(default=None) # type: ignore[assignment]
    motto: str | None = Field(default=None, min_length=1, max_length=510) # type: ignore[assignment]
    instagram: str | None = Field(unique=True, index=True, min_length=1, max_length=30) # type: ignore[assignment]
    email: EmailStr | None = Field(unique=True, index=True, max_length=255) # type: ignore[assignment]
    
    image: UploadFile | None = File(default=None)

class CrewMember(CrewMemberBase, table=True):
    __tablename__ = "crew_member" # type: ignore
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    role_id: uuid.UUID = Field(
        foreign_key="crew_member_role.id",
        index=True,
        ondelete="RESTRICT"
    )
    role: CrewMemberRole = Relationship(
        back_populates="crew_members"
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="crew_members")
    image: CrewMemberImage = Relationship(
        back_populates="crew_member",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
#---------------------