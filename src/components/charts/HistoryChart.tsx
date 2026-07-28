import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { HistoryPoint } from "../../models/History";
import type { ChartType } from "../../models/ChartType";

interface HistoryChartProps {
  history: HistoryPoint[];
  chartType: ChartType;
}

interface ChartSettings {
  dataKey:
    | "gdp"
    | "inflation"
    | "unemployment"
    | "debt"
    | "budgetBalance"
    | "approval";
  name: string;
  isMoney: boolean;
}

const chartSettings: Record<
  Exclude<ChartType, "gdp">,
  ChartSettings
> = {
  inflation: {
    dataKey: "inflation",
    name: "Inflation",
    isMoney: false,
  },
  unemployment: {
    dataKey: "unemployment",
    name: "Unemployment",
    isMoney: false,
  },
  debt: {
    dataKey: "debt",
    name: "National Debt",
    isMoney: true,
  },
  budget: {
    dataKey: "budgetBalance",
    name: "Budget Balance",
    isMoney: true,
  },
  approval: {
    dataKey: "approval",
    name: "Approval Rating",
    isMoney: false,
  },
};

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number): string =>
  `${value.toFixed(1)}%`;

function CustomTooltip({
  active,
  payload,
  label,
  isMoney,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
  }>;
  label?: number | string;
  isMoney: boolean;
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
            {isMoney
              ? formatMoney(numericValue)
              : formatPercent(numericValue)}
          </div>
        );
      })}
    </div>
  );
}

export default function HistoryChart({
  history,
  chartType,
}: HistoryChartProps) {
  const isGdpChart = chartType === "gdp";

 const settings =
  chartType !== "gdp"
    ? chartSettings[chartType]
    : undefined;

  const isMoney =
    isGdpChart || settings?.isMoney === true;

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <XAxis dataKey="quarter" />

          <YAxis
            tickFormatter={(value: number) =>
              isMoney
                ? formatMoney(value)
                : formatPercent(value)
            }
          />

          <Tooltip
            content={
              <CustomTooltip isMoney={isMoney} />
            }
          />

          {isGdpChart ? (
            <>
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
            </>
          ) : settings ? (
  <Line
    type="monotone"
    dataKey={settings.dataKey}
    name={settings.name}
    stroke="#6ea8fe"
    strokeWidth={3}
    dot={false}
  />
) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}