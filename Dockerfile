FROM node:16

WORKDIR /usr/src/app

COPY ./package.*json ./

RUN npm install -y

COPY . .

EXPOSE 5000

CMD ["npm", "start"]