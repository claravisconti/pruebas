from pydantic import BaseModel
from fastapi import Query

class ProductIn(BaseModel):
    name: str
    description: str
    price: int

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    price: int
    stock: int

class ProductPaginatedResponse(BaseModel):
    data: list[ProductOut]
    total: int
    page: int

class PaginationParams(BaseModel):
    numberPerPage: int = Query(5)
    page: int = Query(0)

class ProductFilters(BaseModel):
    name:str = Query(None)
