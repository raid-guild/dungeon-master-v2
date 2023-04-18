declare namespace NodeJS {
  interface ProcessEnv {
    readonly POSTGRES_DATABASE: string
    readonly POSTGRES_USERNAME: string
    readonly POSTGRES_PASSWORD: string
    readonly POSTGRES_TIMEZONE: string
    readonly POSTGRES_ENDPOINT_PORT: string
    readonly HASURA_ENDPOINT_PROTOCOL: string
    readonly HASURA_ENDPOINT_IP: string
    readonly HASURA_ENDPOINT_PORT: string
    readonly HASURA_ENDPOINT: string
    readonly HASURA_GRAPHQL_ADMIN_SECRET string
    readonly HASURA_GRAPHQL_ENABLED_LOG_TYPES: string
    readonly HASURA_GRAPHQL_ENABLE_CONSOLE: string
    readonly HASURA_GRAPHQL_UNAUTHORIZED_ROLE: string
  }
}
