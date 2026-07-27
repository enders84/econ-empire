import {
  Paper,
  Typography,
} from "@mui/material";

import type { NewsArticle } from "../../models/NewsArticle";

interface WorldNewsPanelProps {
  news: NewsArticle | null;
}

export default function WorldNewsPanel({
  news,
}: WorldNewsPanelProps) {
  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
      >
        🌍 World News
      </Typography>

      {news ? (
        <>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
          >
            {news.title}
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
          >
            {news.description}
          </Typography>
        </>
      ) : (
        <Typography
          align="center"
          color="text.secondary"
        >
          No major world developments this quarter.
        </Typography>
      )}
    </Paper>
  );
}