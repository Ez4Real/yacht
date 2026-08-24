import json
import uuid
from datetime import datetime, timezone

from typing import Annotated
from pydantic import BaseModel, EmailStr, StringConstraints, model_validator
from sqlalchemy import DateTime, UniqueConstraint, TypeDecorator, Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel
from fastapi import UploadFile, File
from enum import Enum


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


HexColor = Annotated[
    str,
    StringConstraints(
        pattern=r"^#[0-9A-Fa-f]{6}$",
        min_length=7,
        max_length=7
    )
]


class PydanticJSONType(TypeDecorator):
    impl = JSONB
    cache_ok = True

    def __init__(self, pydantic_model: type[BaseModel], *args, **kwargs):
        self.pydantic_model = pydantic_model
        super().__init__(*args, **kwargs)

    def process_bind_param(self, value, dialect):
        if value is None:
            return None

        if isinstance(value, BaseModel):
            return value.model_dump(mode="json")

        if isinstance(value, dict):
            return value

        raise TypeError(
            f"Expected {self.pydantic_model.__name__} or dict, "
            f"got {type(value).__name__}"
        )

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return self.pydantic_model.model_validate(value)
    

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
    crew_members: list["CrewMember"] = Relationship(back_populates="owner", cascade_delete=True, passive_deletes=True)
    destinations: list["Destination"] = Relationship(back_populates="owner", cascade_delete=True)
    info_pages: list["InfoPage"] = Relationship(back_populates="owner", cascade_delete=True)


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
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    crew_members: list["CrewMember"] = Relationship(
        back_populates="role",
        cascade_delete=False
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="crew_member_roles")

class CrewMemberRolePublic(CrewMemberRoleBase):
    id: uuid.UUID
    created_at: datetime
    owner_id: uuid.UUID

class CrewMemberRolesPublic(SQLModel):
    data: list[CrewMemberRolePublic]
    count: int
#-------------------------


#-----Crew Member-----
class CrewMemberImage(ImageBase, table=True):
    __tablename__ = "crew_member_image" # type: ignore[assignment]

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    crew_member_id: uuid.UUID = Field(
        foreign_key="crew_member.id",
        ondelete="CASCADE"
    )
    crew_member: "CrewMember" = Relationship(back_populates="image")
    
class CrewMemberImagePublic(ImageBase):
    id: uuid.UUID
    

class CrewMemberBase(SQLModel):
    first_name: str = Field(min_length=1, max_length=64)
    last_name: str = Field(min_length=1, max_length=64)
    background: str = Field(min_length=1, max_length=1024)
    role_id: uuid.UUID
    color: HexColor
    motto: str = Field(min_length=1, max_length=512)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    instagram: str = Field(unique=True, index=True, min_length=1, max_length=30)
    
    @model_validator(mode='before')
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value
    
class CrewMemberCreate(CrewMemberBase):
    image: UploadFile

class CrewMemberUpdateBase(SQLModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=64) 
    last_name: str | None = Field(default=None, min_length=1, max_length=64) 
    background: str | None = Field(default=None, min_length=1, max_length=1024)
    role_id: uuid.UUID | None = Field(default=None) 
    color: HexColor | None = None
    motto: str | None = Field(default=None, min_length=1, max_length=512) 
    instagram: str | None = Field(default=None, unique=True, index=True, min_length=1, max_length=30) 
    email: EmailStr | None = Field(default=None, unique=True, index=True, max_length=255) 

    @model_validator(mode='before')
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value

class CrewMemberUpdate(CrewMemberUpdateBase):
    image: UploadFile | None = File(default=None)
    

class CrewMember(CrewMemberBase, table=True):
    __tablename__ = "crew_member" # type: ignore[assignment]
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="crew_members")
    order: int = Field(index=True, unique=True, gt=0) 
    role_id: uuid.UUID = Field(
        foreign_key="crew_member_role.id",
        index=True,
        ondelete="RESTRICT"
    )
    role: CrewMemberRole = Relationship(
        back_populates="crew_members"
    )
    image: CrewMemberImage = Relationship(
        back_populates="crew_member",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "passive_deletes": True,
        }
    )
    
    
class CrewMemberPublic(CrewMemberBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    role: CrewMemberRolePublic
    image: CrewMemberImagePublic
    
class CrewMembersPublic(SQLModel):
    data: list[CrewMemberPublic]
    count: int


class CrewMemberNavigation(SQLModel):
    previous: uuid.UUID
    next: uuid.UUID

    position: int
    total: int
    
class CrewMemberDetail(SQLModel):
    member: CrewMemberPublic
    navigation: CrewMemberNavigation
#---------------------

#-----Destination-----
class DestinationImageType(str, Enum):
    banner = "banner"
    side = "side"
    
class DestinationImage(ImageBase, table=True):
    __tablename__ = "destination_image" # type: ignore[assignment]
    __table_args__ = (UniqueConstraint("destination_id", "type", name="uq_destination_image_type"),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    destination_id: uuid.UUID = Field(
        foreign_key="destination.id",
        ondelete="CASCADE"
    )
    destination: "Destination" = Relationship(back_populates="images")
    type: DestinationImageType = Field(index=True)
    
class DestinationImagePublic(ImageBase):
    id: uuid.UUID
    type: DestinationImageType
    

class DestinationBase(SQLModel):
    region: str = Field(min_length=1, max_length=64)
    country: str = Field(min_length=1, max_length=64)
    destination: str = Field(min_length=1, max_length=64, unique=True, index=True)
    description: str = Field(min_length=1, max_length=512)
    content1: str = Field(min_length=1, max_length=2048)
    content2: str | None = Field(default=None, max_length=2048)
    
    @model_validator(mode='before')
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value
    
class DestinationCreate(DestinationBase):
    banner_image: UploadFile
    side_image: UploadFile | None = File(default=None)
    
class DestinationUpdateBase(SQLModel):
    region: str | None = Field(default=None, min_length=1, max_length=64)
    country: str | None = Field(default=None, min_length=1, max_length=64)
    destination: str | None = Field(
        unique=True,
        index=True,
        default=None,
        min_length=1,
        max_length=64
    )
    description: str | None = Field(default=None, min_length=1, max_length=512)
    content1: str | None = Field(default=None, max_length=2048)
    content2: str | None = Field(default=None, max_length=2048)
    
    @model_validator(mode='before')
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value
    
    
class DestinationUpdate(DestinationUpdateBase):
    banner_image: UploadFile | None = File(default=None)
    side_image: UploadFile | None = File(default=None)
    
    
class Destination(DestinationBase, table=True):
    __tablename__ = "destination" # type: ignore[assignment]
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="destinations")
    images: list[DestinationImage] = Relationship(
        back_populates="destination",
        cascade_delete=True
    )
    
    @property
    def banner_image(self) -> DestinationImage:
        return next((b for b in self.images if b.type == DestinationImageType.banner))
    @property
    def side_image(self) -> DestinationImage | None:
        return next((b for b in self.images if b.type == DestinationImageType.side), None)
    
    
class DestinationPublic(DestinationBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    banner_image: DestinationImagePublic
    side_image: DestinationImagePublic | None = None
    
class DestinationsPublic(SQLModel):
    data: list[DestinationPublic]
    count: int
    

#-----InfoPage-----
class InfoPageImageType(str, Enum):
    banner = "banner"
    block_1 = "block_1"
    block_2 = "block_2"
    
class InfoPageImage(ImageBase, table=True):
    __tablename__ = "info_page_image" # type: ignore[assignment]
    __table_args__ = (UniqueConstraint("info_page_id", "type", name="uq_info_page_image_type"),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    info_page_id: uuid.UUID = Field(
        foreign_key="info_page.id",
        ondelete="CASCADE"
    )
    info_page: "InfoPage" = Relationship(back_populates="images")
    type: InfoPageImageType = Field(index=True)
    
class InfoPageImagePublic(ImageBase):
    id: uuid.UUID
    type: InfoPageImageType

class InfoPageServiceList(SQLModel):
    title: str = Field(min_length=1, max_length=64)
    content: str = Field(min_length=1, max_length=2048)

class InfoPageBase(SQLModel):
    title: str = Field(default=None, min_length=1, max_length=64, unique=True, index=True)
    description: str = Field(default=None, min_length=1, max_length=512)
    content1: str = Field(default=None, min_length=1, max_length=2048)
    content2: str | None = Field(default=None, max_length=2048)
    content3: str | None = Field(default=None, max_length=2048)
    services: InfoPageServiceList | None = Field(
        default=None,
        sa_column=Column(
            PydanticJSONType(InfoPageServiceList),
            nullable=True,
        ),
    )

    @model_validator(mode="before")
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value
    
class InfoPageCreate(InfoPageBase):
    banner_image: UploadFile
    block_1_image: UploadFile | None = File(default=None)
    block_2_image: UploadFile | None = File(default=None)
    
class InfoPageUpdateBase(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=64, unique=True, index=True)
    description: str | None = Field(default=None, min_length=1, max_length=512)
    content1: str | None = Field(default=None, min_length=1, max_length=2048)
    content2: str | None = Field(default=None, max_length=2048)
    content3: str | None = Field(default=None, max_length=2048)
    services: InfoPageServiceList | None = Field(default=None)
    
    @model_validator(mode='before')
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value
    
    
class InfoPageUpdate(InfoPageUpdateBase):
    banner_image: UploadFile | None = File(default=None)
    block_1_image: UploadFile | None = File(default=None)
    block_2_image: UploadFile | None = File(default=None)
    
    
class InfoPage(InfoPageBase, table=True):
    __tablename__ = "info_page" # type: ignore[assignment]
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="info_pages")
    images: list[InfoPageImage] = Relationship(
        back_populates="info_page",
        cascade_delete=True
    )

    @property
    def banner_image(self) -> InfoPageImage:
        return next((b for b in self.images if b.type == InfoPageImageType.banner))
    @property
    def block_1_image(self) -> InfoPageImage | None:
        return next((b for b in self.images if b.type == InfoPageImageType.block_1), None)
    @property
    def block_2_image(self) -> InfoPageImage | None:
        return next((b for b in self.images if b.type == InfoPageImageType.block_2), None)
    
    
class InfoPagePublic(InfoPageBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    banner_image: InfoPageImagePublic
    block_1_image: InfoPageImagePublic | None = None
    block_2_image: InfoPageImagePublic | None = None
    
class InfoPagesPublic(SQLModel):
    data: list[InfoPagePublic]
    count: int


class InfoPageMenuItemPublic(SQLModel):
    id: uuid.UUID
    created_at: datetime
    owner_id: uuid.UUID
    title: str

class InfoPageMenuItemsPublic(SQLModel):
    data: list[InfoPageMenuItemPublic]
    count: int