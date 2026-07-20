interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  variant?: 'normal' | 'success' | 'danger' | 'neutral' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function CurrencyDisplay({ amount, currency = 'S/', variant = 'normal', size = 'md' }: CurrencyDisplayProps) {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const [integers, decimals] = absAmount.toFixed(2).split('.');
  const formattedIntegers = parseInt(integers, 10).toLocaleString('en-US');

  let colorClass = 'var(--color-text)';
  if (variant === 'success') colorClass = 'var(--color-success)';
  if (variant === 'danger') colorClass = 'var(--color-danger)';
  if (variant === 'neutral') colorClass = 'var(--color-text-muted)';
  if (variant === 'light') colorClass = '#ffffff';

  const sizeStyles = {
    sm: { symbol: '0.75rem', int: '1rem', dec: '0.75rem' },
    md: { symbol: '0.9rem', int: '1.25rem', dec: '0.9rem' },
    lg: { symbol: '1.2rem', int: '2rem', dec: '1.2rem' },
    xl: { symbol: '1.5rem', int: '3.2rem', dec: '1.5rem' },
  }[size];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: 'var(--font-mono)', color: colorClass }}>
      {isNegative && <span style={{ fontSize: sizeStyles.int, fontWeight: 700, marginRight: '2px' }}>-</span>}
      <span style={{ fontSize: sizeStyles.symbol, fontWeight: 600, marginRight: '4px', opacity: 0.7 }}>
        {currency}
      </span>
      <span style={{ fontSize: sizeStyles.int, fontWeight: 800, letterSpacing: '-0.03em' }}>
        {formattedIntegers}
      </span>
      <span style={{ fontSize: sizeStyles.dec, fontWeight: 700, opacity: 0.55, marginLeft: '2px' }}>
        .{decimals}
      </span>
    </div>
  );
}
