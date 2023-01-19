import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    address?: string;
  }

  interface Session {
    token?: string;
    user?: User;
  }

  interface JWT {
    user: User;
  }
}
