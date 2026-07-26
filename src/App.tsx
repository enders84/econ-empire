import { useState } from "react";
import type { GameState } from "./models/GameState";
import { simulateQuarter } from "./engine/simulation";
import Dashboard from "./components/Dashboard";
import NewsPanel from "./components/NewsPanel";

function App() {
const [economy, setEconomy] = useState<GameState>({
  quarter: 1,

  gdp: 500,
  inflation: 2.0,
  unemployment: 5.0,
  debt: 200,
  approval: 60,

  incomeTax: 25,
  governmentSpending: 150,
  interestRate: 4.5,
});

  const [headline, setHeadline] = useState(
    "The economy remains stable as the new administration takes office."
  );

  function endQuarter() {
    setEconomy((currentEconomy) =>
      simulateQuarter(currentEconomy)
    );

    const news = [
      "📈 Technology companies report record profits.",
      "🏭 Manufacturing output increased this quarter.",
      "📉 Inflation concerns continue to worry consumers.",
      "💼 Businesses hire thousands of new workers.",
      "🌎 International trade boosted exports.",
      "⚡ Energy prices increased across the country.",
      "🏦 The central bank signals future policy changes.",
    ];

    const randomIndex = Math.floor(Math.random() * news.length);
    setHeadline(news[randomIndex]);
  }

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <Dashboard economy={economy} />

      <NewsPanel headline={headline} />

      <button
        onClick={endQuarter}
        style={{
          marginTop: "10px",
          padding: "12px 24px",
          fontSize: "18px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        End Quarter
      </button>
    </div>
  );
}

export default App;