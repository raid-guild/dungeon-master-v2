/* eslint-disable no-param-reassign */
/* eslint-disable no-return-await */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { client } from '../../../gql';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(_.get(credentials, 'message', '{}'))
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          const nextAuthHost = _.get(nextAuthUrl, 'host');
          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          await siwe.validate(_.get(credentials, 'signature', ''));
          return {
            id: siwe.address,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const authSecret = process.env.NEXTAUTH_SECRET;

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
      maxAge: 60 * 30, // 30 minute token expiration
    },
    jwt: {
      // A secret to use for key generation (you should set this explicitly)
      secret: authSecret,
      // Set to true to use encryption (default: false)
      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      encode: async ({ secret, token, maxAge }: any) => {
        if (token.id) return jwt.sign(token, secret, { algorithm: 'HS256' });
        let userId = '';
        let username = '';
        let roles = [];
        let isCommunity = false;

        // TODO handle these asyncs better
        try {
          const address = _.toLower(token.sub);
          const result = {};
          // const result = await client().query({
          //   query: userLookupQuery,
          //   variables: {
          //     address,
          //   },
          // });

          if (!_.isEmpty(_.get(result, 'data.users'))) {
            userId = _.get(_.first(_.get(result, 'data.users')), 'id');
            username = _.get(_.first(_.get(result, 'data.users')), 'username');
            roles = _.map(
              _.get(_.first(_.get(result, 'data.users')), 'user_roles'),
              'roleByRole.role'
            );
          } else {
            // const createUserResult = await client().mutate({
            //   mutation: addUserMutation,
            //   variables: {
            //     address,
            //   },
            // });
            const createUserResult = {};
            userId = _.get(
              _.first(_.get(createUserResult, 'data.insert_users.returning')),
              'id'
            );
          }

          // add default roles for logged in and anonymous
          roles = [...roles, 'user', 'public'];
          isCommunity = _.includes(roles, 'community');
        } catch (error) {
          console.log(error);
        }

        const jwtClaims = {
          sub: _.get(token, 'sub'),
          id: userId,
          name: username,
          address: _.get(token, 'sub'),
          roles,

          iat: Date.now() / 1000,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': roles,
            'x-hasura-default-role': isCommunity ? 'community' : 'user',
            'x-hasura-role': isCommunity ? 'community' : 'user',
            'x-hasura-user-id': userId,
          },
        };
        const encodedToken = jwt.sign(jwtClaims, secret, {
          algorithm: 'HS256',
        });

        return encodedToken;
      },
      decode: async (params) => {
        const { secret, token }: any = params;
        const decodedToken: any = jwt.verify(token, secret, {
          algorithms: ['HS256'],
        });
        return decodedToken;
      },
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        return true;
      },
      async session({ session, token }: { session: any; token: any }) {
        // create account

        session.user = {
          id: _.get(token, 'id'),
          name: _.get(token, 'name') || _.get(token, 'sub'),
          address: _.get(token, 'sub'),
          image: '',
        };

        session.roles = _.get(token, 'roles');
        // TODO this seems not great, but easier than SSR on those pages?
        session.token = jwt.sign(token, authSecret, { algorithm: 'HS256' });
        return session;
      },
      async jwt({ token, user, account, profile, isNewUser }) {
        return token;
      },
    },
  });
}
