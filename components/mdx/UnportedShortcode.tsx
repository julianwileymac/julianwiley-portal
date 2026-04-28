export function UnportedShortcode({ source }: { source: string }) {
  return (
    <div
      style={{
        background: "#fef3c7",
        border: "1px dashed #d97706",
        borderRadius: 8,
        padding: "10px 14px",
        margin: "12px 0",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 13,
        color: "#92400e",
      }}
    >
      <strong style={{ display: "block", marginBottom: 4 }}>
        ⚠️ Unported Hugo shortcode (manual conversion needed):
      </strong>
      <code style={{ wordBreak: "break-word" }}>{source}</code>
    </div>
  );
}
