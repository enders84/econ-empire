import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

export type StatusLevel =
  | "good"
  | "warning"
  | "critical"
  | "neutral";

interface StatusCardProps {
  title: string;
  value: string;
  status?: StatusLevel;
  description?: string;
}

const statusStyles: Record<
  StatusLevel,
  {
    label: string;
    color: string;
    background: string;
  }
> = {
  good: {
    label: "Healthy",
    color: "#66bb6a",
    background: "rgba(102, 187, 106, 0.12)",
  },

  warning: {
    label: "Warning",
    color: "#ffa726",
    background: "rgba(255, 167, 38, 0.12)",
  },

  critical: {
    label: "Critical",
    color: "#ef5350",
    background: "rgba(239, 83, 80, 0.12)",
  },

  neutral: {
    label: "Stable",
    color: "#90a4ae",
    background: "rgba(144, 164, 174, 0.12)",
  },
};

export default function StatusCard({
  title,
  value,
  status = "neutral",
  description,
}: StatusCardProps) {
  const style = statusStyles[status];

  return (
    <Paper
      sx={{
        p: 2.5,
        height: "100%",
        borderTop: `4px solid ${style.color}`,
        backgroundColor: style.background,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: style.color,
            fontWeight: 800,
          }}
        >
          {style.label}
        </Typography>
      </Box>

      <Typography
        variant="h4"
        sx={{
          mt: 1,
          fontWeight: 800,
        }}
      >
        {value}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "text.secondary",
          }}
        >
          {description}
        </Typography>
      )}
    </Paper>
  );
}