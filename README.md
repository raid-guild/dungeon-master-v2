# Dungeon Master v2

Monorepo built with [nx](https://nx.dev/)

### How to run locally

1. Copy env file

```sh
cp apps/frontend/.env.example ./apps/frontend/.env.local
```

2. Install dependencies with Yarn.

```sh
yarn
```

3. Run frontend app locally.

```sh
yarn dev
```

4. Open the app in your browser at https://localhost:4200

## using 'nx' workspaces

### common commands

build all packages

```sh
yarn nx run-many --target=build --all
```

remove a project

```sh
npx nx generate @nx/workspace:remove --projectName=<your project name>
```

generate a new next.js app

```sh
npx nx generate @nx/next:application <your application name>
```

generate a new react library

```sh
npx nx generate @nx/react:library <your component name>
```

## Running Hasura locally

### Pre-requisites

- Docker
- Docker Compose

### Steps

1. Copy the `.env.example` file to `.env` and fill in the required credentials.
  a. the defaults should work for fresh local development
  b. by default the instance is unsecured and has no permissions or admin secret
2. Run `docker-compose up -d` to start the Hasura server.

This will start the Hasura server on port 8080. Connect the frontend above by using the associated variables.

```sh
NEXT_PUBLIC_API_URL='http://localhost:8080/v1/graphql'
HASURA_GRAPHQL_ADMIN_SECRET=
```

### Running a secure instance

If you want to run a secure instance of Hasura, you can enable the secret, unauthorized role, and JWT authentication. Within the `graphql-engine` service enable these variables:

```js
HASURA_GRAPHQL_UNAUTHORIZED_ROLE
HASURA_GRAPHQL_ADMIN_SECRET
HASURA_GRAPHQL_JWT_SECRET
```

Also enable the `HASURA_GRAPHQL_ADMIN_SECRET` variable in the `hasura-setup` service, in case migrations need to be run.

