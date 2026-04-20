import sharp from 'sharp';

export async function compressImageToBase64(
  input: Buffer,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  let outputBuffer: Buffer;
  let outputMime = 'image/jpeg';

  const metadata = await sharp(input).metadata();
  const hasAlpha = metadata.hasAlpha ?? false;

  // Garder PNG seulement si vraie transparence
  if ((mimeType === 'image/png' || mimeType === 'image/webp') && hasAlpha) {
    outputBuffer = await sharp(input)
      .png({
        compressionLevel: 9,
        quality: 75,
      })
      .toBuffer();

    outputMime = 'image/png';
  } else {
    // Tout le reste → JPEG plus rentable
    outputBuffer = await sharp(input)
      .jpeg({
        quality: 75,
        mozjpeg: true,
      })
      .toBuffer();

    outputMime = 'image/jpeg';
  }

  return `data:${outputMime};base64,${outputBuffer.toString('base64')}`;
}
