FROM ghcr.io/puppeteer/puppeteer:22.11.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /user/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 10000

CMD [ "npm", "run", "start:prod" ]
