import {
  Paper,
  Typography,
} from "@mui/material";

interface EconomicNewsPanelProps {
  headline?: string;
}

export default function EconomicNewsPanel({
  headline = "",
}: EconomicNewsPanelProps) {
  const displayHeadline =
    headline.trim().length > 0
      ? headline
      : "No economic news this quarter.";

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
      >
        Economic News
      </Typography>

      <Typography>
        {displayHeadline}
      </Typography>
    </Paper>
  );
}