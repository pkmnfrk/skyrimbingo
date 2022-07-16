FROM node:14-alpine
WORKDIR /usr/src/app
RUN npm -g i npm && npm i -g nodemon

ADD package.json package-lock.json updateVersion.js ./
RUN npm i

ADD server ./server
ADD static ./static

RUN node updateVersion

EXPOSE 3000
CMD [ "node", "server" ]