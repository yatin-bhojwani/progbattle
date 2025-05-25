

# ProgBattle

*A web-application where you can upload your bot and compete against our system bots*


## Run Locally

Clone the project

```bash
git clone git@github.com:yatin-bhojwani/progbattle.git
```

Go to the project directory

```bash
cd progbattle
```

### Install dependencies:
#### for the backend:
Create a virtual enviornment and start it in the root directory

```bash
python3 -m venv myenv
source myenv/bin/activate
```
Install requirements
```bash
pip install -r requirements.txt
```
Create an env file
```
cp .env.example .env
```
To Start the backend server

```bash
cd backend
python main.py
```
#### For the frontend (in a new terminal):

```bash
cd frontend
cd nextjs-dashboard
npm install
  ```
To start the frontend server
```bash
npm run dev
```





## Development / Work / Research

### Backend:
#### Structure:
the backend contains the main app.py along with other files such as database.py models.py (to define tables) schema.py (to define pydantic models) and it also contains two directories where match logs and userbots are stored


#### Featues:
I have setup the backend in python using the fastapi library and connected it to a POSTGRESSQL database.

I have used SQLAlchemy as an ORM 

This is the table i used and its columns (upload image)

 
**Below is the summary of a few routes (which have some added features) and things i implemented in them:**

#### All the routes have error handling using the HTTPException module of fastapi package.

1.*Signup*: to secure the password sent by the user, I hashed the password using Passlib with bcrypt algorithm making sure that user password could not be hacked from the database

2.*Login*: After confirming the user details, I create a JWT Token that is sent back to the client and stored in a cookie for future authentication/authorisation for protecting sensitive backend routes. I have used the Jose module for the same.

#### All the following routes are protected and can only be accessed after authentication 

3.*Create Team*: The client uploads their team name and it is stored in the table in the database

4.*Upload Bot*: A user can upload their python bot making which is evaluated against the system bot, used UploadFile module of fastapi package to handle recieving the files from the client. The bot file is stored as **teamname.py** in the directory userbots This route evaluates the result against the bot and stores it in a csv file of the name: **teamnamesystem.csv** in the folder usermatches which is created by given **engine.py** file

5.*Get Bot*: It uses the FileResponse method/module of the fastapi package

6.*Join Team*: The frontend sends a request to join a team and if the number of users are less than 4 the user can join the team

7.*Animate*: server sends back the gamelog csv and the animation is created on the frontend using htmlcanvas

All the other routes such as get_bot, delete_bot, get_score, leaderboard are implemented in the standard way where the database is fetched for data.



### Frontend:

I have used next.js to create the frontend of the web-app along with tailwind css, I have used the standard next-js template of the dashboard provided by Vercel and modified it

different directories and routes:
1. app which contains the login and signup directories along with a tournament directory
2. in the tournament directory i have used a layout.tsx to add a leaderboard and name header since they dont change on the change of the page.tsx file. 

#### detailed explanation with demo of the website is uploaded in the video attached in the DemoVideo section

## Demo Video 
link to drive: https://drive.google.com/file/d/13JLRB0h39X8EuH9i8DjFTrr9qw4WF83n/view?usp=sharing
## Testing Routes
Below are details (with images) of how to test different routes in postman: 
Below are details (with images) of how to test different routes in postman: 

**1.Signup: post route and takes json as input**
![Signup](/assets/signup_route.png)

**2.Login: post route and takes json as input**
![Login](/assets/login_route.png)

**3.Auth: for futher routes put your token from login in the bearer token auth**
![Auth](/assets/authexample.png)

**4.Create Team: post route and takes http header as input**
![TeamCreate](/assets/teamcreate_route.png)

**5.Upload Bot: post route that takes form-data as input**
![Upload](/assets/uploadbot_route.png)

**6.Get Bot: get route**
![GetBot](/assets/getbot_route.png)

**7.Leaderboard: doesnt need auth token**
![Leaderboard](/assets/leaderboard_route.png)




