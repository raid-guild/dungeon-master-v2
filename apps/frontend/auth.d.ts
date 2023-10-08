import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    address?: string;
    role: string;
    roles: string[];
  }

  interface Session {
    token?: string;
    user?: User;
  }

  interface JWT {
    user: User;
  }
}
