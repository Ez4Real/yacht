import httpx
from fastapi import APIRouter, HTTPException
from app.core.config import settings
from fastapi import APIRouter, HTTPException
from app.models import  EnquireContactCreate, EnquireContactCreateResponse


router = APIRouter(prefix="/enquire", tags=["enquires"])


@router.post("/", response_model=EnquireContactCreateResponse)
async def create_enquire_contact(
  contact_in: EnquireContactCreate
):
  async with httpx.AsyncClient() as client:
    try:
      response = await client.post(
        f"{settings.GHL_API_URL}/contacts/upsert",
        json={
            **contact_in.model_dump(exclude_none=True),
            "locationId": settings.GHL_LOCATION_ID
        },
        headers={
          "Authorization": f"Bearer {settings.GHL_PRIVATE_TOKEN}",
          "Version": "v3",
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      )
      response.raise_for_status()
      
      return response.json()
    except httpx.HTTPStatusError as exc:
      raise HTTPException(status_code=exc.response.status_code, detail=str(exc))
    except httpx.RequestError as exc:
      raise HTTPException(status_code=400, detail=str(exc))
      