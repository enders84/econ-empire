import type { GameState } from "../models/GameState";

interface DashboardProps {
  economy: GameState;
}

function Dashboard({ economy }: DashboardProps) {
  return (
    <div
      style={{
        backgroundColor: "#1f2937",
        color: "white",
        padding: "25px",
        borderRadius: "12px",
        maxWidth: "500px",
        margin: "20px auto",
        boxShadow: "0 4px 12px rgba(0,0,0,.3)",
      }}
    >
      <h1>🏛️ Econ Empire</h1>

      <h2>Middle Earth</h2>

      <h3>Quarter {economy.quarter}</h3>

      <hr />

      <p>💰 GDP: ${economy.gdp} Billion</p>
      <p>📈 Inflation: {economy.inflation.toFixed(1)}%</p>
      <p>👷 Unemployment: {economy.unemployment.toFixed(1)}%</p>
      <p>🏦 National Debt: ${economy.debt} Billion</p>
      <p>😊 Approval: {economy.approval}%</p>
      <hr />

<h3>Current Policies</h3>

<p>💰 Income Tax: {economy.incomeTax}%</p>

<p>
  🏛️ Total Government Spending: $
  {(
    economy.educationSpending +
    economy.healthcareSpending +
    economy.defenseSpending +
    economy.infrastructureSpending +
    economy.scienceSpending
  ).toFixed(0)}
  B
</p>

<p>🏦 Interest Rate: {economy.interestRate}%</p>
    </div>
  );
}

export default Dashboard;