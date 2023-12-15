// * these should be post `camelize` types, db uses snake_case
export type IMolochStatsBalance = {
  id: string;
  timestamp: string;
  balance: bigint;
  tokenSymbol: string;
  tokenAddress: string;
  tokenDecimals: number;
  transactionHash: string;
  amount: string;
  payment: boolean;
  tribute: boolean;
  counterpartyAddress: string;
  action: string;
  proposalDetail: {
    proposalId: string;
    applicant: string;
    details: string | null;
    lootRequested: string | null;
    sharesRequested: string | null;
  } | null;
};

export type IVaultTransaction = {
  date: Date;
  elapsedDays: number | undefined;
  txExplorerLink: string;
  type: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenAddress: string;
  in: bigint;
  out: bigint;
  net: bigint;
  balance: bigint;
  priceConversion?: number;
  counterparty: string; // receiver/sender to minion vault or sender to treasury
  proposalId?: string;
  proposalLink?: string;
  proposalShares?: bigint; // requested in case of proposal, ragequitted in case of rage quit
  proposalLoot?: bigint; // requested in case of proposal, ragequitted in case of rage quit
  proposalTitle?: string; // title of the proposal in details
  proposalApplicant?: string; // submitted by address
  memberName?: string;
  memberLink?: string;
  escrowLink?: string;
};

export type ICalculatedTokenBalances = {
  [tokenAddress: string]: {
    in: bigint;
    out: bigint;
    balance: bigint;
  };
};

export type ISmartEscrowWithdrawal = {
  escrowId?: string;
  childShare: bigint;
  parentShare: bigint;
  timestamp: string;
  token: string;
};

export type ISmartEscrow = {
  id: string;
  parent: string;
  withdraws: ISmartEscrowWithdrawal[];
};

export type IAccountingRaid = {
  id: string;
  invoiceAddress: string;
  name: string;
};

export type ISpoils = {
  date: Date;
  raidLink: string;
  raidName: string;
  childShare: number;
  parentShare: number;
  priceConversion: number;
  tokenSymbol: string;
};

export type IToken = {
  tokenAddress: string;
  decimals: number;
  symbol: string;
};

export type ITokenBalance = {
  token: IToken;
  tokenSymbol: string;
  date: Date;
  tokenBalance: bigint;
};

export type ITokenBalanceLineItem = ITokenBalance & {
  id: string;
  tokenExplorerLink: string;
  inflow: {
    tokenValue: bigint;
  };
  outflow: {
    tokenValue: bigint;
  };
  closing: {
    tokenValue: bigint;
  };
  priceConversion?: number;
};

export type ITokenPrice = {
  id: number;
  date: string;
  priceUsd: number;
  symbol: string;
};

export type IMappedTokenPrice = {
  [key: string]: {
    [key: string]: number;
  };
};
