FROM hasura/graphql-engine:v2.0.1
# Copy migrations and metadata to default folders
COPY ./services/hasura/migrations /hasura-migrations
COPY ./services/hasura/metadata /hasura-metadata


# start graphql engine after migration
CMD graphql-engine serve 
