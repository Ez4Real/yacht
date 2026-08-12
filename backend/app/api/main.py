from fastapi import APIRouter

from app.api.routes import login, private, users, items, utils, \
    crew_member_roles, crew_members, destinations
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(crew_member_roles.router)
api_router.include_router(crew_members.router)
api_router.include_router(destinations.router)
# api_router.include_router(charters.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
