import { BigNumber } from 'ethers';

// * these should be post `camelize` types, db uses snake_case
export type IMolochStatsBalance = {
  id: string;
  timestamp: string;
  balance: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenDecimals: string;
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
  elapsedDays: number;
  txExplorerLink: string;
  type: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenAddress: string;
  in: number;
  out: number;
  net: number;
  balance: number;
  priceConversion?: number;
  counterparty: string; // receiver/sender to minion vault or sender to treasury
  proposalId?: string;
  proposalLink?: string;
  proposalShares?: BigNumber; // requested in case of proposal, ragequitted in case of rage quit
  proposalLoot?: BigNumber; // requested in case of proposal, ragequitted in case of rage quit
  proposalTitle?: string; // title of the proposal in details
  proposalApplicant?: string; // submitted by address
  memberName?: string;
  memberLink?: string;
  escrowLink?: string;
};

export type ICalculatedTokenBalances = {
  [tokenAddress: string]: {
    in: BigNumber;
    out: BigNumber;
    balance: BigNumber;
  };
};

export type ISmartEscrowWithdrawal = {
  escrowId?: string;
  childShare: BigNumber;
  parentShare: BigNumber;
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
  decimals: string;
  symbol: string;
};

export type ITokenBalance = {
  token: IToken;
  tokenSymbol: string;
  date: Date;
  tokenBalance: BigNumber;
};

export type ITokenBalanceLineItem = ITokenBalance & {
  tokenExplorerLink: string;
  inflow: {
    tokenValue: number;
  };
  outflow: {
    tokenValue: number;
  };
  closing: {
    tokenValue: number;
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
