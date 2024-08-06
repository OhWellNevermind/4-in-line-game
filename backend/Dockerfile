ARG NODE_VERSION=21.6.2

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV development


WORKDIR /app


COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

COPY . .

ENV PORT=5000
ENV DATABASE_URL=postgresql://postgres:postgres@pg_db:5432/4-in-line
ENV DATABASE_URL=postgresql://postgres:postgres@pg_db:5432/4-in-line
ENV GOOGLE_CLIENT_ID=89802538680-g8ge56tinl9obap3bn2qce9i81v8dhan.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV GOOGLE_OAUTH_REDIRECT_URL=http://localhost:5000/auth/google
ENV JWT_SECRET=secret
ENV SALT_ROUNDS=10

RUN npm i -g nodemon
RUN npm i -g ts-node
RUN npm install -D tslib @types/node

CMD [ "npm","run","dev" ]