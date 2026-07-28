import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <CardContent>
        <Typography
          variant="overline"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}