from pydantic import BaseModel
from models.products import Product
from fastapi import Query

class Login(BaseModel):
    email: str
    password: str