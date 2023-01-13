FROM node:16.14.2-alpine3.10

# Create app directory
RUN mkdir -p /usr/src/fms
WORKDIR /usr/src/fms

# Install app dependencies
# ADD package.json /usr/src/test-project
# ADD package-lock.json /usr/src/test-project
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /usr/src/fms/

RUN npm ci

COPY . /usr/src/fms/

EXPOSE 5000

# Build arguments
ARG NODE_VERSION=16

# Environment
ENV NODE_VERSION $NODE_VERSION

CMD ["npm", "run", "start"]
