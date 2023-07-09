FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV port=3000

EXPOSE 3000

CMD [ "npm", "start" ]