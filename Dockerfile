FROM node:lts-alpine3.23
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3000
CMD [ "npm", "run", "start-old-dev" ]