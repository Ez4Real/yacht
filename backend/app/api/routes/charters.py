# from uuid import UUID
# from typing import Any, cast
# from fastapi import APIRouter, HTTPException, Depends, Form, Query
# from sqlmodel import col, func, select

# from app.core.config import settings
# from app.api.deps import CurrentUser, SessionDep, \
#     parse_charter_create, parse_charter_update
# from app.models import Charter, CharterCreate, CharterUpdate, \
#     CharterImageType, CharterImage, CharterPublic, ChartersPublic, \
#     Message
# from app.utils import save_image_to_local, delete_image_from_local


# router = APIRouter(prefix="/charters", tags=["charters"])


# @router.get("/", response_model=ChartersPublic)
# def read_charters(
#   session: SessionDep,
#   skip: int = 0,
#   limit: int = 100
# ) -> ChartersPublic:
#     """
#     Retrieve charters.
#     """

#     count_statement = select(func.count()).select_from(Charter)
#     count = session.exec(count_statement).one()
    
#     statement = (
#         select(Charter)
#         .order_by(col(Charter.created_at).desc())
#         .offset(skip)
#         .limit(limit)
#     )
#     charters = session.exec(statement).all()

#     charters_public = [CharterPublic.model_validate(charter) for charter in charters]
#     return ChartersPublic(data=charters_public, count=count)


# @router.get("/{id}", response_model=CharterPublic)
# def read_charter(session: SessionDep, id: UUID) -> Any:
#     """
#     Get charter by ID.
#     """
#     charter = session.get(Charter, id)
#     if not charter:
#         raise HTTPException(status_code=404, detail="Charter not found")
#     return charter


# @router.post("/", response_model=CharterPublic)
# def create_charter(
#     *,
#     session: SessionDep,
#     current_user: CurrentUser,
#     charter_in: CharterCreate = Depends(parse_charter_create),
# ) -> Any:
#     """
#     Create new charter.
#     """
#     charter = Charter.model_validate(
#         charter_in.model_dump(
#             exclude={"banner_image", "block_1_image", "block_2_image"}
#         ),
#         update={"owner_id": current_user.id}
#     )
    
#     banner_image_url = save_image_to_local(
#         charter_in.banner_image,
#         settings.CHARTER_IMAGES_DIR
#     )
#     banner_image = CharterImage(
#         url=banner_image_url,
#         charter_id=charter.id,
#         type=CharterImageType.banner,
#         alt_text=f"{charter.title} charter banner image",
#     )
#     session.add(banner_image)
#     charter.images.append(banner_image)
    
#     if charter_in.block_1_image:
#         block_1_image_url = save_image_to_local(
#             charter_in.block_1_image,
#             settings.CHARTER_IMAGES_DIR
#         )
#         block_1_image = CharterImage(
#             url=block_1_image_url,
#             charter_id=charter.id,
#             type=CharterImageType.block_1,
#             alt_text=f"{charter.title} charter block 1 image",
#         )
#         session.add(block_1_image)
#         charter.images.append(block_1_image)
        
#     if charter_in.block_2_image:
#         block_2_image_url = save_image_to_local(
#             charter_in.block_2_image,
#             settings.CHARTER_IMAGES_DIR
#         )
#         block_2_image = CharterImage(
#             url=block_2_image_url,
#             charter_id=charter.id,
#             type=CharterImageType.block_2,
#             alt_text=f"{charter.title} charter block 1 image",
#         )
#         session.add(block_2_image)
#         charter.images.append(block_2_image)
        
#     session.add(charter)
    
#     session.commit()
#     session.refresh(charter)
#     return charter


# @router.put("/{id}", response_model=CharterPublic)
# def update_charter(
#     *,
#     session: SessionDep,
#     current_user: CurrentUser,
#     id: UUID,
#     charter_in: CharterUpdate = Depends(parse_charter_update),
# ) -> Any:
#     """
#     Update a charter.
#     """
#     charter = session.get(Charter, id)
#     if not charter:
#         raise HTTPException(status_code=404, detail="Charter not found")
#     if not current_user.is_superuser and (charter.owner_id != current_user.id):
#         raise HTTPException(status_code=403, detail="Not enough permissions")
    
#     charter.sqlmodel_update(
#         charter_in.model_dump(
#             exclude_unset=True,
#             exclude_none=True,
#             exclude={"banner_image", "block_1_image", "block_2_image"}
#         )
#     ) 
    
#     images = {image.type: image for image in charter.images}
    
#     for image_type in CharterImageType:
#         uploaded = getattr(charter_in, f"{image_type.value}_image")
#         if uploaded is None:
#             continue
        
#         image = images.setdefault(
#             image_type,
#             CharterImage(
#                 charter_id=charter.id,
#                 type=image_type,
#                 url="",
#             ),
#         )
        
#         if image not in charter.images:
#             charter.images.append(image)
#         elif image.url:
#             delete_image_from_local(image.url)
        
#         image.url = save_image_to_local(
#             uploaded,
#             settings.DESTINATION_IMAGES_DIR,
#         )
#         image.alt_text = f"{charter.title} charter block 1 image"
        
#     session.add(charter)
#     session.commit()
#     session.refresh(charter)
#     return charter


# @router.delete("/{id}")
# def delete_charter(
#     session: SessionDep, current_user: CurrentUser, id: UUID
# ) -> Message:
#     """
#     Delete a charter.
#     """
#     charter = session.get(Charter, id)
#     if not charter:
#         raise HTTPException(status_code=404, detail="Charter not found")
#     if not current_user.is_superuser and (charter.owner_id != current_user.id):
#         raise HTTPException(status_code=403, detail="Not enough permissions")
    
#     charter_image_keys = ["banner_image", "block_1_image", "block_2_image"]
    
#     for key in charter_image_keys:
#         charter_image = cast(CharterImage | None, getattr(charter, key)) 
        
#         if charter_image:
#             delete_image_from_local(charter_image.url)

#     session.delete(charter)
#     session.commit()
#     return Message(message="Charter deleted successfully")


