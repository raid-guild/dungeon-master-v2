import { RankingInfo, rankings } from '@tanstack/match-sorter-utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CellContext } from '@tanstack/react-table';
import { formatUnits } from 'viem';

const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;

export const exportToCsv = (csvString: string, fileName: string) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.click();
  link.remove();
};

export const formatDate = (date: Date) => date?.toISOString().split('T')[0];

export const formatUnitsAsNumber = (value: bigint, decimals: number) =>
  Number(formatUnits(value, decimals));

export const formatNumber = <TRow>(info: CellContext<TRow, number | bigint>) =>
  info.getValue()?.toLocaleString();

export const getUsdValue = <T extends { priceConversion?: number }>(
  info: CellContext<T, number>
) => {
  const n = info.getValue();
  const priceConversion = info.row.getValue('priceConversion') as number;

  return n * priceConversion;
};

export const sortNumeric = <T>(rowA: any, rowB: any, columnId: string) => {
  const n1 = Number(rowA.getValue(columnId));
  const n2 = Number(rowB.getValue(columnId));
  if (n1 < n2) return -1;
  if (n2 < n1) return 1;
  return 0;
};

const rankValue = <T extends Date | number>(
  rankedValue: T,
  min?: T,
  max?: T
) => {
  const rank =
    (!min || rankedValue >= min) && (!max || rankedValue <= max)
      ? rankings.MATCHES
      : rankings.NO_MATCH;

  return {
    rankedValue,
    rank,
    passed: rank > 0,
  } as RankingInfo;
};

export const minMaxNumberFilter = <TRow>(
  row: any, // Row<TRow>,
  columnId: string,
  columnFilter: number[],
  addMeta: (itemRank: RankingInfo) => void
) => {
  const min = columnFilter?.[0];
  const max = columnFilter?.[1];
  const value = row.getValue(columnId) as number;

  // Rank the item
  const itemRank = rankValue(value, min, max);

  // Store the ranking info
  addMeta(itemRank);

  // if (columnId === 'elapsedDays') {
  //   console.log("minMaxNumberFilter", min, max, value, itemRank.passed);
  // }

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const minMaxDateFilter = <TRow>(
  row: any, // Row<TRow>,
  columnId: string,
  columnFilter: string[],
  addMeta: (itemRank: RankingInfo) => void
) => {
  const min = Date.parse(columnFilter?.[0]);
  const max = Date.parse(columnFilter?.[1]) + DAY_MILLISECONDS;
  const value = (row.getValue(columnId) as Date)?.getTime();

  // Rank the item
  const itemRank = rankValue(value, min, max);

  // Store the ranking info
  addMeta(itemRank);

  // console.log("minMaxDateFilter", min, max, value, itemRank.passed);

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
