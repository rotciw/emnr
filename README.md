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

#### Start the app

`python manage.py runserver`

## Technologies
### Frontend
- TypeScript with React.js
- Redux for state management with Duck pattern
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