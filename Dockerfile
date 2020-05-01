FROM node:10.13.0

MAINTAINER jinhyeokfang <jinhyeokfang@gmail.com>

RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN npm install
RUN npm run build

ENV NODE_ENV development

EXPOSE 80

CMD ["npm", "start"]