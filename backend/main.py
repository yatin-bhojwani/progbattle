from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import uvicorn
import os
from pathlib import Path 
from database import engine, SessionLocal, Base
from datetime import timedelta
from typing import Annotated

import psycopg2
from database import get_db
from models import Users
from schema import UserCreate, User, TokenData, Token, LoginRequest, UserResponse
from database import get_db
from utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY,
    ALGORITHM,
    UPLOAD_DIR
)
from jose import JWTError, jwt
from sqlalchemy import select 
import engine1

import csv
from io import StringIO


## imports for file uploads
from fastapi import UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os

#TODO: implement the getbot route and also to make requirements.txt uptodate and to implement the score system
#TODO: 3.c of the task

app = FastAPI()

#  Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development only!)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

#creates tables if not existing
Base.metadata.create_all(bind=engine)

bearer_scheme = HTTPBearer(auto_error=False)


# Helper function to get user by email
def get_user(db: Session, email: str):
    try:
        return db.query(Users).filter(Users.email == email).first()
    except Exception as e:
        print(f"Database error: {e}")
        return None

# Authentication function
def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user



# Get current user from token
async def get_current_user( token: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    #print(token.credentials)
    try:
        # REAL JWT verification
        payload = jwt.decode(
            token.credentials,  # Extract from Bearer header
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email: str = payload.get("email")
       # print(email)
        if email is None:
            raise credentials_exception
        user1 = get_user(db, email)

        if user1 is None:
            raise credentials_exception
        return user1
    

    except JWTError:
        raise credentials_exception
    
    


#### the signup route
@app.post("/signup", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    try:
        new_user = Users(
            email=user.email,
            hashed_password=get_password_hash(user.password),
            username=user.username
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )


##the login route 
@app.post("/login", response_model=Token)
async def login(
    credentials: LoginRequest, 
    db: Session = Depends(get_db)
):
    # 1. Authenticate
    user = db.query(Users).filter(Users.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    # 2. Create REAL JWT
    access_token = create_access_token(
        data={"email": user.email, "username":user.username}  # Standard JWT field for subject
    )
    
    # 3. Return standards-compliant response
    return {
        "access_token": access_token,
        "token_type": "bearer"  # Required by OAuth2 (even without using OAuth2)
    }


##protected routes
####team creation

## need to add error fetching to this route
@app.post("/teamcreate")
async def protected_route(user : User = Depends(get_current_user), team_name: Annotated[str | None, Header()] = None , db: Session=Depends(get_db)):
    user.team_name = team_name
    db.commit()
    db.refresh(user)
    return {"team": f"{team_name}"}    



##-------------------- FILE UPLOAD SYSTEM ----------------------------
os.makedirs(UPLOAD_DIR, exist_ok=True) ##checks if the directory exists otherwise makes it

@app.post("/uploadbot")
async def upload_file(file: UploadFile = File(...), user : User = Depends(get_current_user), db: Session=Depends(get_db)):
    
    #making sure that the user is part of a team before uploading a file
    if(user.team_name == "None"):
        raise HTTPException(400, "Team not joined")
    try:
        # Save file locally
        userfilename = f"{user.team_name}.py"
        file_path = os.path.join(UPLOAD_DIR, userfilename) ##check for debug originally second para was file.filename
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        user.file = userfilename
        #print(user.file)
        db.commit()
        db.refresh(user)

        #start a match, find score and update it
        user.score = engine1.play_game(f"userbots\{user.file}", "bot1.py", user.team_name, "system")
        db.commit()
        db.refresh(user)

        return {
            "score": f"{user.score}"
        }


         
        
        # return JSONResponse(
        #     status_code=200,
        #     content={
        #         "filename": file.filename,
        #         "content_type": file.content_type,
        #         "size": os.path.getsize(file_path)
        #     }
        # )
    except Exception as e:
        raise HTTPException(500, f"Upload failed: {str(e)}")
    
# TODO: implement deletion of the file from userbots
@app.get("/deletebot")
async def delete_file(user: User = Depends(get_current_user), db: Session=Depends(get_db)):
        try:
            # Delete the physical file first
            file_path = Path(f"C:/Users/Yatin/Documents/pclubTask/backend/userbots/{user.file}")  # Adjust this path
            
            if file_path.exists():  # Check if file exists
                os.unlink(file_path)  # Delete the file
            else:
                # File doesn't exist but record says it should - might want to log this
                pass
            
            # Update database record
            user.file = "None"
            user.score = 0
            db.commit()
            db.refresh(user)
            
           
            
        except Exception as e:
            db.rollback()  # Rollback in case of error
            raise HTTPException(
                status_code=500,
                detail=f"Error deleting file: {str(e)}"
            )

@app.get("/getbot")
async def get_file(user: User = Depends(get_current_user)):
    file_path = f"userbots\\{user.team_name}.py"  # Replace with actual file path
    
    # Check if file exists
    if not os.path.exists(file_path):
        return {"error": "File not found"}, 404
    
    return FileResponse(
        path=file_path
    )

@app.get("/user", response_model=UserResponse)
async def get_file(user: User = Depends(get_current_user)):
    return user


@app.get("/leaderboard")
async def leaderboard(db: Session=Depends(get_db)):
    results = db.query(Users.team_name, Users.score)\
         .filter(Users.team_name != "None")\
         .order_by(Users.score.desc())\
         .limit(16)\
         .all()
    return [{"team_name": team_name, "score": score} for team_name, score in results]


@app.get("/match-data")
async def get_match_data(user: User = Depends(get_current_user)):
    with open(f"usermatches/{user.team_name}system.csv", mode="r") as file:
        csv_data = file.read()
    
    # Parse CSV to JSON
    reader = csv.DictReader(StringIO(csv_data))
    return {"data": list(reader)}
        
       
       
        
        
        
    







    

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)


