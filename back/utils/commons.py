from enum import Enum

class ErrorTypes(Enum):
    NOT_FOUND = "not_found"

class ServiceException(Exception):
    def __init__(self, message: str, error_type: ErrorTypes):
        super().__init__(message)
        self.error_type = error_type