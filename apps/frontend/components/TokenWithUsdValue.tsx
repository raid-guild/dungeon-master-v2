import { formatNumber, getUsdValue } from '@raidguild/dm-utils';
// @ts-expect-error - no types for react-table
import { CellContext } from '@tanstack/react-table';

interface TokenWithUsdValueProps<TRow extends { priceConversion?: number }> {
  info: CellContext<TRow, number>;
}

const TokenWithUsdValue = <TRow extends { priceConversion?: number }>({
  info,
}: TokenWithUsdValueProps<TRow>) => {
  const usdValue = getUsdValue(info);

  return Number.isNaN(usdValue) ? (
    <>{formatNumber(info)}</>
  ) : (
    <div>
      <p>{formatNumber(info)}</p>
      <p>${usdValue.toLocaleString()}</p>
    </div>
  );
};

export default TokenWithUsdValue;
