import {
  Paper,
  Typography,
} from "@mui/material";

interface NewsPanelProps {
  headline: string;
}

export default function NewsPanel({
  headline,
}: NewsPanelProps) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
      >
        📰 Economic News
      </Typography>

      <Typography color="text.secondary">
        {headline ||
          "No major economic news this quarter."}
      </Typography>
    </Paper>
  );
}