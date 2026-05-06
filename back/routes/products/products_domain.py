from sqlalchemy.orm import Session
from sqlalchemy import select, func
from models.products import Product
from .products_schema import ProductIn, PaginationParams, ProductFilters
from utils.commons import ServiceException, ErrorTypes

def apply_pagination(statement, pagination: PaginationParams):
    return statement.limit(pagination.numberPerPage).offset(pagination.page*pagination.numberPerPage)

def apply_filtering(statement, filter: ProductFilters):
    if not filter.name:
        return statement
    return statement.where(Product.name.ilike(f"%{filter.name}%"))

def list(filter: ProductFilters, pagination: PaginationParams, db: Session):
    statement_total = select(func.count()).select_from(Product)
    statement_total = apply_filtering(statement_total, filter)
    total = db.execute(statement_total).scalar()
    statement = select(Product)
    statement = apply_filtering(statement, filter)
    statement = apply_pagination(statement, pagination)
    productos = db.execute(statement).scalars().all()
    return productos, total

def create(input: ProductIn, db: Session):
    producto = Product(**input.model_dump(), stock=15)
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto

def delete(id: int, db: Session):
    product = db.get(Product, id)
    if not product:
        raise ServiceException("Producto inexistente", ErrorTypes.NOT_FOUND)
    db.query(Product).filter(Product.id == id).delete()
    db.commit()

def put(id: int, body: ProductIn, db: Session):
    product = db.get(Product, id)

    if not product:
        raise ServiceException("Producto inexistente", ErrorTypes.NOT_FOUND)

    product.name = body.name
    product.description = body.description
    product.price = body.price

    db.commit()
    db.refresh(product)
    return product
