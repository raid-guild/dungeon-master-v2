# Dungeon Master v2


### Getting Started


1. Copy env file

```
cp apps/frontend/.env.example ./apps/frontend/.env.local
```


2. Fill in the required credentials in env file.

```
HASURA_GRAPHQL_ADMIN_SECRET

NEXTAUTH_SECRET

NEXT_PUBLIC_ALCHEMY_KEY
```

3. Install dependencies with Yarn.

```
yarn
```

4. Run frontend app locally.

```
yarn start
```

5. Open the app in your browser at https://localhost:4200


## using 'nx' workspaces


### common commands

build all packages

```
yarn nx run-many --target=build --all
```

remove a project

```
npx nx generate @nrwl/workspace:remove --projectName=publishable-lib-in-rg
```

generate a new next.js app

```
npx nx generate @nx/next:application app-1
```

generate a new react library

```
npx nx generate @nrwl/react:library component
```

