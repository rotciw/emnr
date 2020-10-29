FROM python:3.8-alpine

ARG DATAPORTEN_CLIENT_ID
ARG DATAPORTEN_OAUTH_AUTH_URL
ARG DATAPORTEN_OAUTH_TOKEN_URL
ARG DATAPORTEN_SECRET
ARG DATAPORTEN_REDIRECT_URI
ARG DATAPORTEN_USER_INFO_URL
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD

ENV DATAPORTEN_CLIENT_ID=${DATAPORTEN_CLIENT_ID}
ENV DATAPORTEN_OAUTH_AUTH_URL=${DATAPORTEN_OAUTH_AUTH_URL}
ENV DATAPORTEN_OAUTH_TOKEN_URL=${DATAPORTEN_OAUTH_TOKEN_URL}
ENV DATAPORTEN_SECRET=${DATAPORTEN_SECRET}
ENV DATAPORTEN_REDIRECT_URI=${DATAPORTEN_REDIRECT_URI}
ENV DATAPORTEN_USER_INFO_URL=${DATAPORTEN_USER_INFO_URL}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBUG 0

WORKDIR /src/backend
# install psycopg2
RUN apk update \
  && apk add --virtual build-deps gcc python3-dev musl-dev \
  && apk add postgresql-dev \
  && pip install psycopg2 \
  && apk del build-deps
COPY requirements.txt /src/backend/
RUN pip install -r requirements.txt
COPY . /src/backend/
RUN adduser -D myuser
USER myuser
CMD gunicorn server.wsgi:application --bind 0.0.0.0:$PORT