from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from config.config import get_db
from routes.auth.auth_domain import login_user
from routes.auth.auth_schema import Login

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Ruta POST de ejemplo
@router.post("/login")
def create_order(body: Login,db: Session = Depends(get_db)):
    try:
        email_respuesta = login_user(body,db)
        response = Response()
        response.set_cookie(
            key="access",
            value=email_respuesta,
        )
        return response
    except:
        return Response(status_code=401)