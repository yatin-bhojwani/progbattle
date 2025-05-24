from database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, text


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    team_name = Column(String, default="None")
    username = Column(String)
    score = Column(Integer , default = 0, index=True)
    file = Column(String, default="None")