export function preprocessAIMarkdown(content: string) {
  return (
    content
      // Fix headings without proper spacing
      .replace(/([^\n])(#{1,6}\s+)/g, "$1\n\n$2")
      .replace(/(#{1,6}\s+[^\n]+)([^\n])/g, "$1\n$2")

      // Fix display math blocks
      .replace(/([^\n])\\\[/g, "$1\n\n\\[")
      .replace(/\\\]([^\n])/g, "\\]\n\n$1")

      // Fix inline math spacing (optional but helps)
      .replace(/([^\s])\\\(/g, "$1 \\(")
      .replace(/\\\)([^\s])/g, "\\) $1")

      // Fix lists that might be too close to other content
      .replace(/([^\n])\n(\s*[-*+]\s+)/g, "$1\n\n$2")
      .replace(/([^\n])\n(\s*\d+\.\s+)/g, "$1\n\n$2")

      // Fix code blocks
      .replace(/([^\n])```/g, "$1\n\n```")
      .replace(/```([^\n])/g, "```\n\n$1")

      // Clean up any triple+ newlines we created
      .replace(/\n{3,}/g, "\n\n")
  );
}

export function preprocessMathDelimiters(content: string) {
  const currencyEscaped = content.replace(/\$(\d[\d,]*(?:\.\d+)?)/g, "\\$$$1");

  const inlineMath = /\\\((.*?)\\\)/gs; // matches $$ … $$
  const displayMath = /\\\[(.*?)\\\]/gs; // matches \[ … \]
  const result = currencyEscaped
    .replace(displayMath, (_match, expr: string) => {
      return `\n$$\n${expr}\n$$\n`;
    })
    .replace(inlineMath, (_match, expr: string) => {
      return `$$${expr}$$`;
    });
  return result;
}
