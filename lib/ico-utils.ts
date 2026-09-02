
/**
 * Converts a PNG data URL to an ICO file format (Blob).
 * This is a minimal implementation that wraps a PNG in the ICO container structure.
 * Modern browsers support PNG-in-ICO, which is simpler than raw BMP encoding.
 *
 * @param pngDataUrl - The data URL of the PNG image.
 * @returns Promise<Blob> - The generated ICO file as a Blob.
 */
export async function pngToIco(pngDataUrl: string): Promise<Blob> {
  // 1. Convert Data URL to ArrayBuffer
  const res = await fetch(pngDataUrl);
  const pngBuffer = await res.arrayBuffer();
  const pngData = new Uint8Array(pngBuffer);

  // 2. Parse PNG dimensions (width at offset 16, height at offset 20 - Big Endian)
  // We assume standard IHDR chunk is at the beginning.
  const dataView = new DataView(pngBuffer);
  const width = dataView.getUint32(16, false);
  const height = dataView.getUint32(20, false);

  // ICO Header (6 bytes)
  // 0-1: Reserved (0)
  // 2-3: Type (1 for ICO)
  // 4-5: Number of images (1)
  const header = new Uint8Array([0, 0, 1, 0, 1, 0]);

  // ICO Directory Entry (16 bytes)
  // 0: Width (0 = 256px)
  // 1: Height (0 = 256px)
  // 2: Color palette (0 = No palette)
  // 3: Reserved (0)
  // 4-5: Color planes (1)
  // 6-7: Bits per pixel (32)
  // 8-11: Size of image data in bytes
  // 12-15: Offset of image data from start of file
  const entry = new ArrayBuffer(16);
  const entryView = new DataView(entry);

  entryView.setUint8(0, width >= 256 ? 0 : width);
  entryView.setUint8(1, height >= 256 ? 0 : height);
  entryView.setUint8(2, 0);
  entryView.setUint8(3, 0);
  entryView.setUint16(4, 1, true); // Color planes
  entryView.setUint16(6, 32, true); // Bits per pixel
  entryView.setUint32(8, pngData.length, true); // Image size
  entryView.setUint32(12, 22, true); // Offset (6 header + 16 entry = 22)

  // 3. Concatenate parts
  const icoBuffer = new Uint8Array(header.length + entry.byteLength + pngData.length);
  icoBuffer.set(header, 0);
  icoBuffer.set(new Uint8Array(entry), 6);
  icoBuffer.set(pngData, 22);

  return new Blob([icoBuffer], { type: "image/x-icon" });
}
