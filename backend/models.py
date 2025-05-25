from database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, text
from sqlalchemy import  ForeignKey, func
from sqlalchemy.orm import relationship, validates
from sqlalchemy.exc import IntegrityError
from database import Base


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    team_name = Column(String, default="None")
    username = Column(String)
    score = Column(Integer , default = 0, index=True)
    file = Column(String, default="None")

class TrueUsers(Base):
    __tablename__ = "trueusers"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    username = Column(String)
    team_id = Column(Integer, ForeignKey("teams.id"))  # Many-to-One
    team = relationship("Team", back_populates="members")  # Link to Team    


class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, default="None")
    members = relationship("TrueUsers", back_populates="team") # One-to-Many
    score = Column(Integer, default = 0)
    activefile = Column(String, default = "None") 
    matches = relationship("MatchLogs", back_populates="team") 
    activelog = Column(String, default = "None")
    
    @validates('members')
    def validate_members(self, key, user):
        if len(self.members) >= 4:
            raise ValueError("Team is full (max 4 members)")
        return user    


class MatchLogs(Base):
    __tablename__ = 'matchlogs'
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey('teams.id'))  # Required team reference
    file = Column(String(500) )  # User-entered string (max 500 chars)
    team = relationship("Team", back_populates="matches")
    score = Column(Integer, default = 0)
    log = Column(String, default="None")
    