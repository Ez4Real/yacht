from collections.abc import Generator
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status, Form, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.core.db import engine
from app.models import TokenPayload, User, \
    CrewMemberBase, CrewMemberCreate, CrewMemberUpdateBase, CrewMemberUpdate, \
    DestinationBase, DestinationCreate, DestinationUpdateBase, DestinationUpdate \
    # CharterBase, CharterCreate, CharterUpdateBase, CharterUpdate

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_active_superuser(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


def parse_crew_member_create(
    crew_member_base: CrewMemberBase = Form(...),
    image: UploadFile = File(),
) -> CrewMemberCreate:
    crew_member_data = crew_member_base.model_dump()
    crew_member = CrewMemberCreate(
        image=image,
        **crew_member_data
    )
    return crew_member

def parse_crew_member_update(
    crew_member_base: CrewMemberUpdateBase = Form(...),
    image: UploadFile | None = File(default=None),
) -> CrewMemberUpdate:
    crew_member_data = crew_member_base.model_dump()
    crew_member = CrewMemberUpdate( 
        image=image, 
        **crew_member_data)
    return crew_member


def parse_destination_create(
    destination_base: DestinationBase = Form(...),
    banner_image: UploadFile = File(),
    side_image: UploadFile | None = File(default=None),
) -> DestinationCreate:
    destination_data = destination_base.model_dump()
    destination = DestinationCreate(
        banner_image=banner_image,
        side_image=side_image,
        **destination_data
    )
    return destination

def parse_destination_update(
    destination_base: DestinationUpdateBase = Form(...),
    banner_image: UploadFile | None = File(default=None),
    side_image: UploadFile | None = File(default=None)
) -> DestinationUpdate:
    destination_data = destination_base.model_dump()
    destination = DestinationUpdate( 
        banner_image=banner_image, 
        side_image=side_image, 
        **destination_data)
    return destination


# def parse_charter_create(
#     charter_base: CharterBase = Form(...),
#     banner_image: UploadFile = File(),
#     block_1_image: UploadFile | None = File(default=None), 
#     block_2_image: UploadFile | None = File(default=None), 
# ) -> CharterCreate:
#     charter_data = charter_base.model_dump()
#     charter = CharterCreate(
#         banner_image=banner_image,
#         block_1_image=block_1_image,
#         block_2_image=block_2_image,
#         **charter_data
#     )
#     return charter

# def parse_charter_update(
#     charter_base: CharterUpdateBase = Form(...),
#     banner_image: UploadFile | None = File(default=None),
#     block_1_image: UploadFile | None = File(default=None), 
#     block_2_image: UploadFile | None = File(default=None), 
# ) -> CharterUpdate:
#     charter_data = charter_base.model_dump()
#     charter = CharterUpdate( 
#         banner_image=banner_image,
#         block_1_image=block_1_image,
#         block_2_image=block_2_image,
#         **charter_data)
#     return charter