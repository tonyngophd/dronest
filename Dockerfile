FROM node:12 AS build-stage

WORKDIR /react-app
COPY react-app/. .

# You have to set this because it should be set during build time.
ENV REACT_APP_BASE_URL="https://dronest.herokuapp.com"
# ENV REACT_APP_WS_URL="wss://dronestms.herokuapp.com:8080"
#not sure how

# Build our React App
RUN npm install
RUN npm run build

RUN cd ..
WORKDIR /messenger_server
COPY messenger_server/. .

# You have to set this because it should be set during build time.
# ENV REACT_APP_WS_URL="wss://dronestms.herokuapp.com:8080"

# Build our messenger_server app
RUN npm install
#RUN npm run build
ENV NODE_ENV=production
# RUN npm start
CMD [ "npm", "start" ]



FROM python:3.8
# Setup Flask environment
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=False

EXPOSE 8000 8080

WORKDIR /var/www
COPY . .
COPY --from=build-stage /messenger_server app/static/
COPY --from=build-stage /react-app/build/* app/static/

# Install Python Dependencies
RUN pip install -r requirements.txt
RUN pip install psycopg2

# Run flask environment
CMD gunicorn app:app


