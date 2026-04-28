export function EmbedPdf({ url, height = 720 }: { url: string; height?: number }) {
  return (
    <div style={{ margin: "16px 0", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
      <object data={url} type="application/pdf" width="100%" height={height}>
        <p>
          PDF preview unavailable.{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open the PDF in a new tab.
          </a>
        </p>
      </object>
    </div>
  );
}
