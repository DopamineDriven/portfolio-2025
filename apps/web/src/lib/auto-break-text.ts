/**
 * Automatically breaks text into lines that fit within the given width.
 *
 * @param text - The full string to be broken into lines.
 * @param containerWidth - The maximum width (in pixels) for a single line.
 * @param font - The CSS font string (e.g., "16px sans-serif") to match the rendered text.
 * @returns An array of strings, each representing a line.
 */
export function autoBreakText(
  text: string,
  containerWidth: number,
  font: string
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return [text];
  }
  context.font = font;

  const words = text.split(" ");
  const lines = Array.of<string>();
  let currentLine = "";

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const { width } = context.measureText(testLine);
    if (width > containerWidth && currentLine !== "") {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

