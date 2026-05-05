from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.orders.orders_router import router as OrderRouter
from routes.products.products_router import router as ProductRouter
from config.config import Base, engine
from models.products import Product
from models.orders import Order

app = FastAPI(
    title="Mi API",
    description="API base con FastAPI",
    version="1.0.0"
)

# 👉 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permite todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc
    allow_headers=["*"],  # todos los headers
)

app.include_router(OrderRouter)
app.include_router(ProductRouter)

Base.metadata.create_all(bind=engine)