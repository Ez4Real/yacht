import httpx
from fastapi import APIRouter
from app.core.config import settings
from app.models import  EnquireContactCreate, EnquireContactGHLCreate, \
    EnquireContactCreateResponse
from app.utils.exceptions import raise_ghl_error

router = APIRouter(prefix="/enquire", tags=["enquires"])


@router.post("/", response_model=EnquireContactCreateResponse)
async def create_enquire_contact(
  contact_in: EnquireContactCreate
):
  ghl_contact = EnquireContactGHLCreate(
    **contact_in.model_dump(exclude_none=True),
    locationId=settings.GHL_LOCATION_ID,
  )

  try:
    async with httpx.AsyncClient() as client:
      response = await client.post(
        f"{settings.GHL_API_URL}/contacts/upsert",
        json=ghl_contact.model_dump(exclude_none=True),
        headers={
          "Authorization": f"Bearer {settings.GHL_PRIVATE_TOKEN}",
          "Version": "v3",
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      )
      
      response.raise_for_status()
      ghl_response = response.json()
      
    return EnquireContactCreateResponse(
      success=True,
      message="Contact created successfully.",
      data=ghl_response,
    )
  
  except httpx.HTTPStatusError as exc:
    raise_ghl_error(
      status_code=502,
      code="GHL_UPSERT_FAILED",
      message="Failed to create contact in GoHighLevel.",
      details=exc.response.text,
    )

  except httpx.TimeoutException:
    raise_ghl_error(
      status_code=504,
      code="GHL_TIMEOUT",
      message="GoHighLevel request timed out.",
    )

  except httpx.RequestError:
    raise_ghl_error(
      status_code=503,
      code="GHL_UNAVAILABLE",
      message="GoHighLevel is currently unavailable.",
    )