from sqlalchemy import Column, String
from config.config import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True)
    email = Column(String(100), nullable=False)
    password_hash = Column(String(200), nullable=False)
    role = Column(String(100), nullable=False)
