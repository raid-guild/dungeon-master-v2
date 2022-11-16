// eslint-disable-next-line import/prefer-default-export
export const truncateAddress = (addr: string): string =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;
