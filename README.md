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
  - **app (ex. user) ** - overview over user projects
    - **admins.py** - file contaning definitions to connect models to the django admin panel
    - **urls.py** - contains mapping between urls and views
    - **models.py** - contains data models
    - **tests/** - contains tests for the module. [View Testing in Django](https://docs.djangoproject.com/en/2.1/topics/testing/) for more.