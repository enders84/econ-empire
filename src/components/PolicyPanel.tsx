import {
  Box,
  Divider,
  Paper,
  Slider,
  Typography,
} from "@mui/material";

export interface PolicyDraft {
  incomeTax: number;
  interestRate: number;
  educationSpending: number;
  healthcareSpending: number;
  defenseSpending: number;
  infrastructureSpending: number;
  scienceSpending: number;
}

interface PolicyPanelProps {
  policies: PolicyDraft;
  onPolicyChange: (
    policy: keyof PolicyDraft,
    value: number,
  ) => void;
}

interface PolicySliderProps {
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}

function PolicySlider({
  label,
  value,
  minimum,
  maximum,
  step,
  suffix,
  onChange,
}: PolicySliderProps) {
  const handleChange = (
    _event: Event,
    newValue: number | number[],
  ) => {
    if (typeof newValue === "number") {
      onChange(newValue);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            color: "primary.main",
            fontWeight: 700,
          }}
        >
          {value.toFixed(1)}
          {suffix}
        </Typography>
      </Box>

      <Slider
        value={value}
        min={minimum}
        max={maximum}
        step={step}
        onChange={handleChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(sliderValue) =>
          `${sliderValue}${suffix}`
        }
      />
    </Box>
  );
}

export default function PolicyPanel({
  policies,
  onPolicyChange,
}: PolicyPanelProps) {
  return (
    <Paper
      sx={{
        p: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
        }}
      >
        Economic Policy
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mt: 0.5,
        }}
      >
        These policy changes will take effect when you advance
        to the next quarter.
      </Typography>

      <Divider
        sx={{
          my: 3,
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 4,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            Fiscal and Monetary Policy
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 3,
            }}
          >
            <PolicySlider
              label="Income Tax"
              value={policies.incomeTax}
              minimum={0}
              maximum={60}
              step={1}
              suffix="%"
              onChange={(value) =>
                onPolicyChange("incomeTax", value)
              }
            />

            <PolicySlider
              label="Central Bank Interest Rate"
              value={policies.interestRate}
              minimum={0}
              maximum={20}
              step={0.25}
              suffix="%"
              onChange={(value) =>
                onPolicyChange("interestRate", value)
              }
            />
          </Box>
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            Government Spending
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 3,
            }}
          >
            <PolicySlider
              label="Education"
              value={policies.educationSpending}
              minimum={0}
              maximum={100}
              step={1}
              suffix=""
              onChange={(value) =>
                onPolicyChange("educationSpending", value)
              }
            />

            <PolicySlider
              label="Healthcare"
              value={policies.healthcareSpending}
              minimum={0}
              maximum={100}
              step={1}
              suffix=""
              onChange={(value) =>
                onPolicyChange("healthcareSpending", value)
              }
            />

            <PolicySlider
              label="Infrastructure"
              value={policies.infrastructureSpending}
              minimum={0}
              maximum={100}
              step={1}
              suffix=""
              onChange={(value) =>
                onPolicyChange(
                  "infrastructureSpending",
                  value,
                )
              }
            />

            <PolicySlider
              label="Defense"
              value={policies.defenseSpending}
              minimum={0}
              maximum={100}
              step={1}
              suffix=""
              onChange={(value) =>
                onPolicyChange("defenseSpending", value)
              }
            />

            <PolicySlider
              label="Science and Research"
              value={policies.scienceSpending}
              minimum={0}
              maximum={100}
              step={1}
              suffix=""
              onChange={(value) =>
                onPolicyChange("scienceSpending", value)
              }
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}