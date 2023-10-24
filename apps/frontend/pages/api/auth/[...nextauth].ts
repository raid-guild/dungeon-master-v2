import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  siweCredentials,
  authorizeSiweMessage,
  extendSessionWithUserAndToken,
  encodeAuth,
  decodeAuth,
  CONFIG,
} from '@raidguild/dm-utils';

const { NEXTAUTH_SECRET } = process.env;

const siweProvider = CredentialsProvider({
  name: 'Ethereum',
  credentials: siweCredentials,
  authorize: (credentials, req: NextApiRequest) =>
    authorizeSiweMessage({ credentials, req }),
});

type NextAuthOptions = Parameters<typeof NextAuth>[2];

const Auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const options: NextAuthOptions = authOptions;

  return NextAuth(req, res, options);
};

export default Auth;

export const authOptions: NextAuthOptions = {
  providers: [siweProvider],
  session: { strategy: 'jwt', maxAge: CONFIG.defaultMaxAge },
  jwt: {
    secret: NEXTAUTH_SECRET,
    encode: encodeAuth,
    // used any because not sure how to type this
    decode: decodeAuth as any,
  },
  callbacks: { session: extendSessionWithUserAndToken },
};
