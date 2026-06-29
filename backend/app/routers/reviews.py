from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models import Review
from app.schemas import ReviewCreate, ReviewOut
from app.auth import get_current_user, get_current_staff
from app.models import User

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("", response_model=List[ReviewOut])
async def list_reviews(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Review).options(selectinload(Review.user)).order_by(Review.date.desc())
    )
    return result.scalars().all()


@router.post("", response_model=ReviewOut, status_code=201)
async def create_review(
    data: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = Review(user_id=current_user.id, comment=data.comment, rating=data.rating)
    db.add(review)
    await db.commit()
    await db.refresh(review)

    result = await db.execute(
        select(Review).options(selectinload(Review.user)).where(Review.id == review.id)
    )
    return result.scalar_one()


@router.delete("/{review_id}", status_code=204)
async def delete_review(review_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_staff)):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.delete(review)
    await db.commit()
