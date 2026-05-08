from sqlalchemy import select
from sqlalchemy.orm import Session

from models.users import User
from .auth_schema import Login
from utils.commons import ServiceException, ErrorTypes
import hashlib

def hashear(password: str):
    return hashlib.md5(password.encode()).hexdigest()

def login_user(body: Login, db: Session):
    password_hash = hashear(body.password)
    statement = select(User).where(body.email==User.email).where(password_hash==User.password_hash)
    find_email = db.execute(statement).scalar()
    if(not find_email):
        raise ServiceException("Credenciales inválidas")
    return body.email