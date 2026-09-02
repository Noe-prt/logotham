/**
 * Watermark utilities for free tier exports.
 * Renders "Made with Logotham" text in the bottom-right corner.
 */

/**
 * Applies a watermark to a PNG data URL by drawing on a canvas.
 * @param dataUrl - The PNG image as a data URL
 * @param size - The dimension of the square image
 * @returns A new data URL with the watermark applied
 */
export async function applyWatermarkToPng(
  dataUrl: string,
  size: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Draw the original image
      ctx.drawImage(img, 0, 0, size, size);

      // Apply watermark
      renderWatermark(ctx, size);

      // Return as data URL
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for watermarking"));
    };

    img.src = dataUrl;
  });
}

/**
 * Renders the watermark text onto a canvas context.
 * @param ctx - The 2D canvas rendering context
 * @param size - The dimension of the canvas
 */
export function renderWatermark(
  ctx: CanvasRenderingContext2D,
  size: number
): void {
  const text = "Made with Logotham";
  // Font size: 3% of export size, minimum 8px
  const fontSize = Math.max(8, Math.floor(size * 0.03));
  const padding = 8;

  ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(128, 128, 128, 0.3)";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(text, size - padding, size - padding / 2);
}

/**
 * Applies a watermark to an SVG data URL by embedding a text element.
 * @param svgDataUrl - The SVG as a data URL
 * @param size - The dimension of the SVG
 * @returns A new SVG data URL with the watermark embedded
 */
export function applyWatermarkToSvg(svgDataUrl: string, size: number): string {
  try {
    // Extract SVG content from data URL
    const commaIndex = svgDataUrl.indexOf(",");
    if (commaIndex === -1) {
      return svgDataUrl;
    }

    const encodedContent = svgDataUrl.substring(commaIndex + 1);
    const svgContent = decodeURIComponent(encodedContent);

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgEl = doc.documentElement;

    if (!svgEl || svgEl.tagName !== "svg") {
      return svgDataUrl;
    }

    // Create watermark text element
    const svgNS = "http://www.w3.org/2000/svg";
    const textEl = doc.createElementNS(svgNS, "text");

    const fontSize = Math.max(8, Math.floor(size * 0.03));
    const padding = 8;

    textEl.setAttribute("x", String(size - padding));
    textEl.setAttribute("y", String(size - padding / 2));
    textEl.setAttribute("text-anchor", "end");
    textEl.setAttribute("dominant-baseline", "text-bottom");
    textEl.setAttribute(
      "style",
      `font-family: system-ui, -apple-system, sans-serif; font-size: ${fontSize}px; fill: rgba(128, 128, 128, 0.3);`
    );
    textEl.textContent = "Made with Logotham";

    svgEl.appendChild(textEl);

    const serialized = new XMLSerializer().serializeToString(doc);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;
  } catch (error) {
    console.error("Failed to apply watermark to SVG", error);
    return svgDataUrl;
  }
}
