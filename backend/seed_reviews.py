"""
Run from the backend directory:
  python seed_reviews.py
"""
import asyncio
from datetime import datetime, timedelta, timezone
from app.database import engine, Base
from app.models import User, Review
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

FAKE_USERS = [
    {"first_name": "Layla",   "last_name": "Hassan",   "email": "layla.h@seed.com",   "username": "layla_h"},
    {"first_name": "Nour",    "last_name": "Khoury",   "email": "nour.k@seed.com",    "username": "nour_k"},
    {"first_name": "Rima",    "last_name": "Azar",     "email": "rima.a@seed.com",    "username": "rima_a"},
    {"first_name": "Sara",    "last_name": "Gemayel",  "email": "sara.g@seed.com",    "username": "sara_g"},
    {"first_name": "Maya",    "last_name": "Salameh",  "email": "maya.s@seed.com",    "username": "maya_s"},
    {"first_name": "Tara",    "last_name": "Khalil",   "email": "tara.k@seed.com",    "username": "tara_k"},
    {"first_name": "Dina",    "last_name": "Moussa",   "email": "dina.m@seed.com",    "username": "dina_m"},
]

FAKE_REVIEWS = [
    {"rating": "5", "comment": "Mary is absolutely incredible at what she does. My facial treatment left my skin glowing for weeks. I won't go anywhere else!", "days_ago": 3},
    {"rating": "5", "comment": "Had the most relaxing eyelash perming session. The results are stunning and so natural-looking. Highly recommend to everyone!", "days_ago": 8},
    {"rating": "5", "comment": "Best nail care in Lebanon, honestly. The attention to detail is unmatched and the atmosphere is so warm and welcoming.", "days_ago": 14},
    {"rating": "5", "comment": "The mesotherapy treatment was a game changer for my skin. Mary really knows her craft. Already booked my next appointment!", "days_ago": 21},
    {"rating": "5", "comment": "I've tried many beauty salons in Beirut but Mary Nassif Chbat is on another level. The makeup artistry is truly professional.", "days_ago": 28},
    {"rating": "4", "comment": "Lovely experience from start to finish. The wax care was gentle and thorough. The booking process online was so easy too!", "days_ago": 35},
    {"rating": "5", "comment": "Mary's hands are magic. My skin has never looked better after the facial. The clinic is clean, professional and so relaxing.", "days_ago": 42},
]

async def seed():
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        from sqlalchemy import select

        hashed = pwd.hash("SeedPass#2026")

        for i, u in enumerate(FAKE_USERS):
            # Skip if user already exists
            existing = await session.execute(select(User).where(User.email == u["email"]))
            if existing.scalar_one_or_none():
                print(f"  skip existing user {u['email']}")
                continue

            user = User(
                email=u["email"],
                username=u["username"],
                first_name=u["first_name"],
                last_name=u["last_name"],
                hashed_password=hashed,
                gender="Female",
            )
            session.add(user)
            await session.flush()

            r = FAKE_REVIEWS[i]
            review = Review(
                user_id=user.id,
                comment=r["comment"],
                rating=r["rating"],
                date=datetime.now(timezone.utc) - timedelta(days=r["days_ago"]),
            )
            session.add(review)
            print(f"  + {u['first_name']} {u['last_name']} → review added")

        await session.commit()
        print("Done.")

if __name__ == "__main__":
    asyncio.run(seed())
