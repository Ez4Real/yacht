from fastapi import APIRouter

from app.api.routes import crew_members, login, private, users, crew_member_roles, crew_members, items, utils
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(crew_member_roles.router)
api_router.include_router(crew_members.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
