# TDT4290-gr13

## UNINETT - Feide expo
Group 13 are going to develop to be used as an "example-app" for a EdHackathon early 2021. The solution will be based on FEIDE as an authentication provider. 

## Git-conventions

branches:

- master: update only for deployment (merge from dev)
- dev: development branches, update continously
- feat/feature-name: a branch that creates/improves a new feature into dev
- design/area-name: a branch that creates/improves GUI/UX into dev
- fix/bug-name: a branch that fixes a bug for dev

Pull request:

- At least two collaborators have to approve a pull request before it is merged in to dev-branch
- Always use "Squash and merge" as merge-options
## Setup
### Server
#### Installation with examples for ubuntu. Windows and OSX is mostly the same
Clone the project to your machine.

#### Setup and activation of virtualenv (env that prevents python packages from being installed globaly on the machine)
Navigate into the project folder.

`pip install virtualenv`

`virtualenv env`

For mac/linux:

`source env/bin/activate`

For windows:

`env\Scripts\activate.bat`

If you get an error related to charmap on Windows, run this command:
`set PYTHONIOENCODING=UTF-8`

#### Setup env environment
In order to test the application you have to register an application [here](https://dashboard.dataporten.no/)
The redirect_uri for development is http://localhost:3000/verifylogin as it is setup that way in the frontend. Remember to ask for additional rettigheter/scopes inside the dashboard.

create an .env file with the same fields as the env.example file. The fields are found within the dataporten dashboard.

#### Install python requirements

`pip install -r requirements.txt`

#### Migrate database

`python manage.py migrate`

#### Create superuser

Create a local admin user by entering the following command:

`python manage.py createsuperuser`

Only username and password is required


## Running the backend and frontend with local postgres
`docker-compose -f dev.docker-compose.yml up -d`

#### Start the app without Docker

`python manage.py runserver`

## Technologies
### Frontend
- TypeScript with React.js
- Context for state management
- Styled Components for styling

### Server
- Python with Django
- PostgreSQL (Dockerized for local development)

## Folder structure

### Server
- **server/** django project folder containing the project modules
  - **app (ex. user)** - overview over user projects
    - **admins.py** - file contaning definitions to connect models to the django admin panel
    - **urls.py** - contains mapping between urls and views
    - **models.py** - contains data models
    - **tests/** - contains tests for the module. [View Testing in Django](https://docs.djangoproject.com/en/2.1/topics/testing/) for more.


## Installation guide

### End user manual
End users can access the product by going to https://emnr.no in a web browser of their choice. They will be presented by the login page (https://emnr.no/login) with the logo and an explanatory text about EMNR and a login button, which, when clicked on, takes them to the Feide login site. After completing the Feide login, they will be taken to the landing page (https://emnr.no). There, they can access all functionality of the web application.

### Development setup guide
This section details how to setup the project for development. The easiest way to set it up is through the use of Docker, but it is also possible to do it manually.

#### Prerequisites
- Python 3 / pip
- If using Docker:
  - Docker Engine for Linux or Docker Desktop for Mac/Windows
  - Docker Compose (if using Linux)
- If setting up manually:
  - Node/npm

#### Setup procedure
- Make sure the project is cloned locally onto your computer. You can do this by typing
`git clone https://github.com/rotciw/emnr.git`
in a terminal from your desired directory.
- Setup an env environment:
  - Navigate into the server folder from root.
  - Create an .env file in the server directory with the same fields as the env.example file.
  - The fields `DATAPORTEN_CLIENT_ID` and `DATAPORTEN_SECRET` are the only ones that needs to be filled in development. Contact the team for these values. (The application still runs without, but you cannot log into the application.)
- Setup server by creating a virtual environment, running database migrations, and filling the database with
course information:
  - Make sure python is added to system variables. This can be checked by typing `python` in a command prompt or terminal. If the python interpreter does not open, you have to add python to your system variables. Follow [these instructions](https://projects.raspberrypi.org/en/projects/using-pip-on-windows/4).
  - Navigate into the server folder from the root folder (emnr).
  - If you do not already have virtualenv installed, run the command `pip install virtualenv`
  - To create a new virtual environment,  run the command `virtualenv env` (or `python -m venvenv` on Windows).
  - To activate your newly created virutal environment navigate to (if you are using Windows) `env/Scripts` and run `activate bat`. If you are using MacOS/Linux you can run `source env/bin/activate` without navigating away from the server directory.
  - You are now running a virtual environment. This should be indicated by a `(env)`next to you path in the prompt.
  - To install the python requirements, make sure you are running a virtual environment. In the server directory run the command `pip install -r requirements.txt`.
  - To migrate the database, run `python manage.py migrate`.
  - To fill your local database with courses from the grades.no-API, start a Django shell, using `python manage.py shell`, and then running the command `exec(open("course/fill_db.py")).read())`. (Warning: this may take a while)

#### Setup using Docker
- Remember to start up Docker in your respective OS..
- `cd` into the root (emnr) directory you cloned.
- run `docker-compose -f "dev.docker-compose.yml" up`.
You can run `docker-compose -f "dev.docker-compose.yml" down` to quit.
- The application is now available at localhost:3000, and the backend at localhost:8000.

#### Setting up manually
- Start the backend server:
  - Start the server by running the command `python manage.py runserver`
  - The local server will now run on localhost:8000.
  - Create a superuser (local admin user) by runnin the command
  `python manage.py createsuperuser` (fill in your preferred username and password).
  - You can use your superuser in the Django admin panel, at localhost:8000/admin.
- Set up and start the frontend server:
  - Navigate to the `frontend` directory
  - Run `npm install`
  - After installing all dependencies, run `npm start`.
  - The frontend project should then open a new tab in your we browser with the running React project ar localhost:3000.

### Development usage guide
After initially setting up the project, it can be started again by doing the following: 
- With Docker:
  - Start Docker
  - Open a terminal window into the root (emnr) directory you cloned
  - Run `docker-compose -f "dev.docker-compose.yml" up`. You can run `docker-compose -f"dev.docker-compose.yml" down`to quit.
  - The application is now available at localhost:3000 and the backend at localhost:8000.
- Without Docker:
  - Open a terminal window in the backend directory (server).
  - Start the Django server by running `python manage.py runserver`.
  - Open another terminal window in the frontend directory (frontend).
  - Start the frontend server by running `npm start`.
  - The application is now available at localhost:3000 and the backend at localhost:8000.
  - Closing the terminal windows or quitting inside them will quit.


