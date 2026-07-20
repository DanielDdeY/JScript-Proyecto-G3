import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

interface ChartDataPoint {
  date: string;
  amount: number;
}

interface SaldoTrendChartProps {
  readonly data: ChartDataPoint[];
}

export function SaldoTrendChart({ data }: SaldoTrendChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ height: 80, width: '100%', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
            itemStyle={{ color: 'var(--color-text)' }}
            formatter={(value: number | string) => [`S/ ${Number(value).toLocaleString()}`, 'Saldo']}
            labelStyle={{ color: 'var(--color-text-muted)', marginBottom: 4 }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
