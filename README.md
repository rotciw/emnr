# EMNR - TDT4290 Group 13

## About EMNR
EMNR is a personalized course reviewing service intended for NTNU students, to help them decide on what courses to enlist in. The project team have developed EMNR as part of the course TDT4290 at NTNU, during Fall 2020. The project was commissioned by [Uninett](https://www.uninett.no/), with the intention of it being used as a showcase of using data made available through Feide. The product is intended to be shown at the EdInnovation Hackathon early 2021.

## End user manual
End users can access the product by going to https://emnr.no in a web browser of their choice. They will be presented with the login page (https://emnr.no/login) with the logo and an explanatory text about EMNR and a login button, which, when clicked on, takes them to the Feide login site. After completing the Feide login, they will be taken to the landing page (https://emnr.no). There, they can access all functionality of the web application.

## Git-conventions

Branches:

- master: update only for deployment (merge from dev)
- dev: development branches, update continously
- feat/feature-name: a branch that creates/improves a new feature into dev
- design/area-name: a branch that creates/improves GUI/UX into dev
- fix/bug-name: a branch that fixes a bug for dev

Pull request:

- At least one collaborator has to approve a pull request before it is merged in to dev-branch

## Technologies
### Frontend
- TypeScript with React.js (Dockerized for local development)
- Context for state management
- Styled Components for styling

### Server
- Python with Django
- PostgreSQL (Dockerized for local development)

## Installation guide
This section details how to setup the project for development. The easiest way to set it up is through the use of Docker, but it is also possible to do it manually.

### Prerequisites
- [Python 3 / pip](https://www.python.org/downloads/)
- If using Docker:
  - [Docker Engine for Linux or Docker Desktop for Mac/Windows](https://docs.docker.com/engine/install/)
  - [Docker Compose (if using Linux)](https://docs.docker.com/compose/install/)
- If setting up manually:
  - [Node/npm](https://nodejs.org/en/download/)

### Setup procedure
- Make sure the project is cloned locally onto your computer. You can do this by typing
`git clone https://github.com/rotciw/emnr.git`
in a terminal from your desired directory.
- Setup an env environment:
  - Navigate into the server folder from root.
  - Create an .env file in the server directory with the same fields as the env.example file.
  - The fields `DATAPORTEN_CLIENT_ID` and `DATAPORTEN_SECRET` are the only ones that needs to be filled for development. These values can be obtained by registering a new application at the [Dataporten Dashboard](https://dashboard.dataporten.no/#!/_), with OAuth 2.0 Redirect URL set to http://localhost:3000/verifylogin. After creating the app, you have to add all scopes except social network ID on the "Rettigheter" tab on the app page. When this is done, the CLIENT_ID and CLIENT_SECRET can be found under the "OAuth detaljer" tab on the app page.
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

### Setup using Docker
- Remember to start up Docker in your respective OS..
- `cd` into the root (emnr) directory you cloned.
- run `docker-compose -f "dev.docker-compose.yml" up`.
You can run `docker-compose -f "dev.docker-compose.yml" down` to quit.
- The application is now available at localhost:3000, and the backend at localhost:8000.

### Setting up manually
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

## Running the project after installation
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

## Directory structure
This section of the README covers the general directory layout for both the frontend and backend parts of the project.

### React frontend
As React does not have any official guide for structuring files, the team have opted to follow a common approach. The team chose to group files by file types. For instance, components, styles, pages and assets, are all grouped inside their respective folders.
```
frontend/src/
├── App/                        <- Files for the default App component.
│   └── ...    
├── assets/                     <- Contains assets used.
│   ├── icons/                  <- Contains icons used.
│   └── images/                 <- Contains images used.
├── components/                 <- Reusable React components.
│   └── ...    
├── context/                    <- Contains the global state management context. 
│   └── GlobalStateContext.tsx
├── fonts/                      <- Contains fonts used.
│   └── ...    
├── navigation/                 <- Routing files to navigate between pages.
│   └── ...    
├── pages/                      <- Different pages that are routed to/from.
│   └── ...    
├── styles/                     <- Styles and reusable styled components.
│   └── ...    
├── utils/   <- Utility files.
│   └── ...    
└── ...
```

### Django backend
The structure of the backend part of the project follows [the typical way of structuring a Django project with applications](https://www.askpython.com/django/django-app-structure-project-structure). The diagram below shows the directory layout of the Django project. The different apps are detailed further in the API documentation, provided in the project report.
```
server/
├── .env               <- File containing environment variables.
├── .gitignore         <- Django/Python-specific .gitignore
├── db.sqlite3         <- SQLite3 database used when developing
├── server/            <- Main app for the project
│   ├── settings.py    <- Django settings file
│   ├── urls.py        <- Server URL configuration (app-level)
│   └── ...
├── <app>/             <- Directory for all files pertaining to a certain app
│   ├── migrations/    <- Migration files for app models
│   │   └── ...
│   ├── admin.py       <- File for registering models in the admin panel
│   ├── models.py      <- Database model definitions
│   ├── tests.py       <- Unit tests for the views.
│   ├── urls.py        <- URL routing within each app.
│   ├── views.py       <- All views for the app, i.e. endpoints and helper methods.
│   └── ...
└── ...
```
