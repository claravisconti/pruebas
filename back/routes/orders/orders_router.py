from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


items = []

# Ruta de ejemplo con parámetro
@router.get("/")
def read_order():
    return items

class OrderIn(BaseModel):
    nombre: str
    price: int
    description: str

# Ruta POST de ejemplo
@router.post("/")
def create_order(body: OrderIn):
    items.append(body)
    return body