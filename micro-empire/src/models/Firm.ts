export interface Firm {
  name: string;

  // Player decisions
  price: number;
  production: number;
  advertising: number;

  // Product differentiation
  brandStrength: number;

  // Operating results
  unitsSold: number;
  revenue: number;

  // Costs
  fixedCosts: number;
  variableCostPerUnit: number;
  totalCosts: number;

  // Performance
  profit: number;
  marketShare: number;
}