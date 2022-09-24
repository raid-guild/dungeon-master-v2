# DM Hasura


## Local Development

Requires installed Docker, Docker Compose and Hasura CLI locally.

```bash
# cd into this directory
docker compose up
# open new terminal
# cd into this directory
hasura console
```

Initial migrations & metadata

On the first load of the DB/console you'll need to migrate the db & add metadata. Create an `.env` to set the variables.

```bash
hasura migrations apply
hasura seeds apply
hasura metadata apply
```


