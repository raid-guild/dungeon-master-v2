import {
  authorizeSiweMessage,
  CONFIG,
  decodeAuth,
  encodeAuth,
  extendSessionWithUserAndToken,
  siweCredentials,
} from '@raidguild/dm-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const { NEXTAUTH_SECRET } = process.env;

const siweProvider = CredentialsProvider({
  name: 'Ethereum',
  credentials: siweCredentials,
  authorize: (credentials, req: NextApiRequest) =>
    authorizeSiweMessage({ credentials, req }),
});

type NextAuthOptions = Parameters<typeof NextAuth>[2];

export const authOptions: NextAuthOptions = {
  providers: [siweProvider],
  session: { strategy: 'jwt', maxAge: CONFIG.defaultMaxAge },
  jwt: {
    secret: NEXTAUTH_SECRET,
    encode: encodeAuth,
    // used any because not sure how to type this
    decode: decodeAuth as any,
  },
  callbacks: {
    jwt: async ({ token }) => {
      // For existing sessions, check if the token is expiring soon
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpiringSoon =
        (token.exp as number) - (currentTime as number) <
        CONFIG.refreshThreshold; // Threshold for "expiring soon" 5 min
      if (isExpiringSoon) {
        // Extend the token's expiration if it's expiring soon
        return {
          ...token,
          exp: Math.floor(Date.now() / 1000) + CONFIG.defaultMaxAge,
          iat: Math.floor(Date.now() / 1000),
        };
      }

      return token;
    },
    session: extendSessionWithUserAndToken,
  },
};

const Auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const options: NextAuthOptions = authOptions;

  return NextAuth(req, res, options);
};

export default Auth;
