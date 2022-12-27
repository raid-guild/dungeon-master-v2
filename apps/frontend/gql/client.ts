import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

interface setLinkProps {
  token?: string;
  thirdPartyUri?: string;
}

const setLink = ({ token, thirdPartyUri }: setLinkProps) => {
  const httpLink = new HttpLink({ uri: thirdPartyUri ? thirdPartyUri : API_URL });
  
  if (thirdPartyUri && !token) {
    return httpLink;
  }

  const authLink = new ApolloLink((operation: any, forward: any) => {
    // Use the setContext method to set the HTTP headers.
    const headers: {
      authorization?: string | null;
      'x-hasura-admin-secret'?: string | undefined | null;
    } = {};
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    if (ADMIN_SECRET) {
      headers['x-hasura-admin-secret'] = ADMIN_SECRET;
    }

    operation.setContext({
      headers,
    });

    // Call the next link in the middleware chain.
    return forward(operation);
  });

  return authLink.concat(httpLink);
};

const client = (token?: string, thirdPartyUri?: string) =>
  new ApolloClient({
    link: setLink({ token, thirdPartyUri }),
    cache: new InMemoryCache(),
  });

export default client;
