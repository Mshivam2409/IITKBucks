FROM node:12.18.2
RUN mkdir server
WORKDIR /server
EXPOSE 3492
CMD [ "yarn", "start" ]