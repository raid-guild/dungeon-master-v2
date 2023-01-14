import { CellContext } from '@tanstack/react-table';
import { formatNumber, getUsdValue } from '../utils';

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
