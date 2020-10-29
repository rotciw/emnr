FROM node:12-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
# RUN npm run build
CMD ["npm", "start"]