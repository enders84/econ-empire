import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { HistoryPoint } from "../../models/History";

interface HistoryChartProps {
  history: HistoryPoint[];
}

const money = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
  }>;
  label?: number | string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "#ffffff",
        color: "#111111",
        padding: "12px",
        border: "1px solid #cccccc",
        borderRadius: "6px",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        Quarter {label}
      </div>

      {payload.map((entry) => {
        const numericValue = Number(entry.value);

        return (
          <div key={entry.name}>
            {entry.name}:{" "}
            {Number.isFinite(numericValue)
              ? money(numericValue)
              : entry.value}
          </div>
        );
      })}
    </div>
  );
}

export default function HistoryChart({
  history,
}: HistoryChartProps) {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <XAxis dataKey="quarter" />

          <YAxis
            tickFormatter={(value: number) =>
              `$${value.toLocaleString()}`
            }
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="gdp"
            name="GDP"
            stroke="#4caf50"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="potentialGdp"
            name="Potential GDP"
            stroke="#9e9e9e"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}