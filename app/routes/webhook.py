from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_services import process_instagram_link
from app.database.db import save_link

router = APIRouter()

class MessageSchema(BaseModel):
    message: str
    from_user: str

@router.post("/webhook")
async def receive_message(data: MessageSchema):
    link = data.message
    raw_user = data.from_user

    # Extract phone number
    phone_number = raw_user.split("@")[0]
    phone_number = "+" + phone_number
    user = phone_number

    ai_result = await process_instagram_link(link)

    save_link(user, link, ai_result)

    return {
        "status": "saved",
        "ai_result": ai_result
    }