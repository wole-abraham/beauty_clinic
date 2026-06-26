from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models import User
from app.schemas import UserOut
from app.auth import get_current_staff

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=List[UserOut])
async def list_users(db: AsyncSession = Depends(get_db), _=Depends(get_current_staff)):
    result = await db.execute(select(User).where(User.is_superuser == False))
    return result.scalars().all()
