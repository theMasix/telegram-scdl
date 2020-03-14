FROM node:10-slim

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN apt-get update && apt-get install -y --no-install-recommends \
  python3-dev \
  python3-pip

RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . ./

EXPOSE 8080

CMD ["npm", "start" ]