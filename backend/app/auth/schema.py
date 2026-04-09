from pydantic import BaseModel, Field

from app.utils.auth_validation import ValidatedPassword, ValidatedUsername

class SignUpRequest(BaseModel):
    username: ValidatedUsername = Field(..., description="Valid username")
    password: ValidatedPassword = Field(..., description="Valid password")

class SignUpResponse(BaseModel):
    message: str
    username: str

class SignInRequest(BaseModel):
    username: ValidatedUsername = Field(..., description="Valid username")
    password: ValidatedPassword = Field(..., description="Valid password")


class SignInResponse(BaseModel):
    message: str
    username: str

class SignOutResponse(BaseModel):
    message: str