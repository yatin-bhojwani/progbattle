from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str | None = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    

    class Config:
        from_attributes  = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(UserBase):
    team_name: str
    score: int
    file: str

    class Config:
        from_attributes  = True


