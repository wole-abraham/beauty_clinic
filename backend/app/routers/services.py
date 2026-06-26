from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Service
from app.schemas import ServiceCreate, ServiceOut
from app.auth import get_current_staff
from typing import List

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=List[ServiceOut])
async def list_services(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Service))
    return result.scalars().all()


@router.post("", response_model=ServiceOut, status_code=201)
async def create_service(data: ServiceCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_staff)):
    service = Service(servicetype=data.servicetype, price=data.price)
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=204)
async def delete_service(service_id: int, db: AsyncSession = Depends(get_db), _=Depends(get_current_staff)):
    result = await db.execute(select(Service).where(Service.id == service_id))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    await db.delete(service)
    await db.commit()
