export const COLORS = {
  heading: "#111",
  body: "#333",
  secondary: "#555",
  muted: "#999",
  blockquote: "#666",
  code: "#666",
  inlineLink: "#2563eb",
  inlineCodeBg: "#f3f4f6",
};

export function applyResumeStyles(structuralBlocks) {
  return structuralBlocks.map((block, i) => {
    const prev = structuralBlocks[i - 1];

    switch (block.type) {
      case "h1":
        return { ...block, fontScale: 1.5, bold: true, mb: 4, color: COLORS.heading };

      case "h2":
        return { ...block, fontScale: 0.85, bold: true, mt: 18, mb: 3, color: COLORS.muted };

      case "h3": {
        const afterSection = prev?.type === "h2";
        return { ...block, fontScale: 1, bold: true, mt: afterSection ? 0 : 10, mb: 2, color: COLORS.heading };
      }

      case "h4":
        return { ...block, fontScale: 0.95, bold: true, mt: 8, mb: 2, color: COLORS.body };

      case "h5":
        return { ...block, fontScale: 0.9, bold: true, mt: 6, mb: 2, color: COLORS.secondary };

      case "h6":
        return { ...block, fontScale: 0.85, bold: false, mt: 4, mb: 2, color: COLORS.secondary };

      case "hr":
        return { type: "hr" };

      case "blockquote":
        return {
          ...block,
          fontScale: 0.95,
          bold: false,
          italic: true,
          mb: 3,
          color: COLORS.blockquote,
          indent: block.depth * 16,
        };

      case "code-block":
        return { ...block, fontScale: 0.85, bold: false, mb: 6, color: COLORS.code, monospace: true };

      case "ul-item":
      case "ol-item":
        return { ...block, fontScale: 1, bold: false, mb: 3, color: COLORS.secondary };

      case "paragraph": {
        if (prev?.type === "h3") {
          return { ...block, fontScale: 0.8, bold: false, mb: 6, color: COLORS.muted };
        }
        if (prev?.type === "h1") {
          return { ...block, fontScale: 1, bold: false, mb: 6, color: COLORS.secondary };
        }
        if (prev?.type === "paragraph" && i >= 2 && structuralBlocks[i - 2]?.type === "h1") {
          return { ...block, fontScale: 0.8, bold: false, mb: 16, color: COLORS.muted };
        }
        return { ...block, fontScale: 1, bold: false, mb: 6, color: COLORS.body };
      }

      default:
        return { ...block, fontScale: 1, bold: false, mb: 6, color: COLORS.body };
    }
  });
}
