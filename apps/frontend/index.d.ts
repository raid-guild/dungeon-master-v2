/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'lodash';

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}
