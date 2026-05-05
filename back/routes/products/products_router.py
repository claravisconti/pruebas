from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from config.config import get_db
from .products_schema import ProductIn, PaginationParams, ProductPaginatedResponse, ProductFilters
from .products_domain import list, create, delete, put
from utils.commons import ServiceException

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

items = []

# Ruta de ejemplo con parámetro
@router.get("/")
def read_item(filter: ProductFilters = Depends(), pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    result, total = list(pagination, db)
    return Response(ProductPaginatedResponse(
        data=result,
        page=pagination.page,
        total=total
    ))

# Ruta POST de ejemplo
@router.post("/")
def create_item(body: ProductIn, db: Session = Depends(get_db)):
    return Response(create(body, db), status_code=201)

# Ruta DELETE de ejemplo
@router.delete("/{id}")
def delete_item(id: int, db: Session = Depends(get_db)):
    try:
        delete(id, db)
        return Response(status_code=204)
    except ServiceException as e:
        return Response(e.message, status_code=204)

# Ruta PUT de ejemplo
@router.put("/{id}")
def put_item(id: int, body: ProductIn, db: Session = Depends(get_db)):
    try:
        return Response(put(id, body, db))
    except ServiceException as e:
        return Response(e.message, status_code=204)
