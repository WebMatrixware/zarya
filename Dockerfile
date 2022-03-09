FROM node:14

EXPOSE 8080

RUN mkdir -p /opt/zarya
RUN mkdir -p /opt/zarya/app
RUN mkdir -p /opt/zarya/app/html

COPY ./app/package.json /opt/zarya/app/
COPY ./app/html/package.json /opt/zarya/app/html/

RUN npm install --prefix /opt/zarya/app/
RUN npm install --prefix /opt/zarya/app/html/

COPY ./ /opt/zarya/

WORKDIR /opt/zarya/app
ENTRYPOINT npm start

LABEL author="Ben Lanning <blanning@all-mode.com>"
LABEL version="1.0.2"
