import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  history: any[];
}

export default function HistoryChart({ history }: Props) {
  console.log("HistoryChart rendered", history);

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <XAxis dataKey="quarter" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="gdp"
            stroke="#4caf50"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}