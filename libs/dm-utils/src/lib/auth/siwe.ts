import _ from 'lodash';
import { User } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import {
  SiweAuthorizeParams,
  SiweMessageAuthorizeParams,
  SiweCredentialParams,
} from '@raidguild/dm-types';

const { NEXTAUTH_URL } = process.env;

const defaultCredential = { type: 'text', placeholder: '0x0' };

export const siweCredentials = {
  message: { label: 'Message', ...defaultCredential },
  signature: { label: 'Signature', ...defaultCredential },
};

const parseCredentials = ({ credentials, req }: SiweAuthorizeParams) => {
  const siwe = new SiweMessage(JSON.parse(_.get(credentials, 'message', '{}')));
  return Promise.resolve({ siwe, credentials, req });
};

const checkNonce = async ({
  siwe,
  credentials,
  req,
}: SiweMessageAuthorizeParams) =>
  getCsrfToken({ req: { headers: req.headers } })
    .then((nonce: string | undefined) => {
      if (!_.eq(_.get(siwe, 'nonce'), nonce)) {
        return Promise.reject(Error('Invalid nonce'));
      }
      return Promise.resolve({ siwe, credentials, req });
    })
    .catch((error: Error) => {
      console.log('here', error);
    });

const checkDomain = ({
  siwe,
  credentials,
}: SiweCredentialParams): Promise<SiweCredentialParams> => {
  if (!NEXTAUTH_URL) {
    return Promise.reject(Error('Invalid set domain'));
  }
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({ siwe, credentials });
  }
  if (!_.eq(_.get(siwe, 'domain'), new URL(NEXTAUTH_URL).host)) {
    return Promise.reject(Error('Invalid domain'));
  }
  return Promise.resolve({ siwe, credentials });
};

const checkSignature = ({
  siwe,
  credentials,
}: SiweCredentialParams): Promise<SiweCredentialParams> =>
  siwe
    .validate(_.get(credentials, 'signature', ''))
    .then(() => Promise.resolve({ siwe, credentials }))
    .catch((error: Error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      return Promise.reject(Error('Invalid signature'));
    });

export const authorizeSiweMessage = (
  data: SiweAuthorizeParams
): Promise<User | null> =>
  parseCredentials(data)
    .then((d: any) => checkNonce(d))
    .then((d: any) => checkDomain(d))
    .then((d: any) => checkSignature(d))
    .then(
      ({ siwe }) => ({ id: _.get(siwe, 'address') }) // TODO _.toLower
    )
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    });
