import {
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { GameEvent } from "../../models/GameEvent";

interface QuarterlyEventPanelProps {
  currentEvent: GameEvent | null;
}

interface EventEffect {
  label: string;
  value: number;
  prefix?: string;
  suffix: string;
}

function formatEffect({
  value,
  prefix = "",
  suffix,
}: EventEffect) {
  const sign = value > 0 ? "+" : "";

  const formattedValue = value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  });

  return `${sign}${prefix}${formattedValue}${suffix}`;
}

export default function QuarterlyEventPanel({
  currentEvent,
}: QuarterlyEventPanelProps) {
  if (!currentEvent) {
    return null;
  }

  const effects: EventEffect[] = [
    {
      label: "GDP effect",
      value: currentEvent.gdp,
      prefix: "$",
      suffix: "B",
    },
    {
      label: "Inflation effect",
      value: currentEvent.inflation,
      suffix: "%",
    },
    {
      label: "Unemployment effect",
      value: currentEvent.unemployment,
      suffix: "%",
    },
    {
      label: "Approval effect",
      value: currentEvent.approval,
      suffix: "%",
    },
  ];

  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
      >
        🎲 Quarterly Event: {currentEvent.name}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        {currentEvent.description}
      </Typography>

      <Stack spacing={0.75}>
        {effects.map((effect) => (
          <Typography key={effect.label}>
            <strong>{effect.label}:</strong>{" "}
            {formatEffect(effect)}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}