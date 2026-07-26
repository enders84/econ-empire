interface NewsPanelProps {
  headline: string;
}

function NewsPanel({ headline }: NewsPanelProps) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        border: "2px solid #d1d5db",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "500px",
        margin: "20px auto",
      }}
    >
      <h2>📰 Economic News</h2>

      <p style={{ fontSize: "18px" }}>{headline}</p>
    </div>
  );
}

export default NewsPanel;