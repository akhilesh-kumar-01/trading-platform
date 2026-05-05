export const formatPrice = (n) => {
  if (!n) return '---';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: n < 1 ? 6 : 2,
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n);
};

export const formatChange = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '---';
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
};


export const formatVolume = (n) => {
  if (!n) return '---';
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toFixed(2);
};

export const formatPnL = (n) => {
  if (!n) return '$0.00';
  const sign = n >= 0 ? '+' : '-';
  return `${sign}$${Math.abs(n).toFixed(2)}`;
};
