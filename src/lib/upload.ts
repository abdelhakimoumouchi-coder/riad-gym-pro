import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export type UploadFolder = 'products' | 'banners' | 'categories';

interface SaveFileOptions {
  folder: UploadFolder;
  filename?: string;
  resize?: { width: number; height: number };
  quality?: number;
}

/**
 * Save and optimize an uploaded image file
 * @param file - The file to save (Buffer or File object)
 * @param options - Options for saving the file
 * @returns The relative path to the saved file
 */
export async function saveUploadedFile(
  file: Buffer | File,
  options: SaveFileOptions
): Promise<string> {
  const {
    folder,
    filename,
    resize = { width: 1200, height: 1200 },
    quality = 85,
  } = options;

  // Generate filename if not provided
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileName = filename || `${timestamp}-${randomString}.webp`;

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });

  // Get buffer from file
  let buffer: Buffer;
  if (file instanceof Buffer) {
    buffer = file;
  } else {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  }

  // Process and save image with Sharp
  const filePath = path.join(uploadDir, fileName);
  await sharp(buffer)
    .resize(resize.width, resize.height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(filePath);

  // Return relative path for storage in database
  return `/uploads/${folder}/${fileName}`;
}

/**
 * Save multiple uploaded files
 * @param files - Array of files to save
 * @param options - Options for saving files
 * @returns Array of relative paths to saved files
 */
export async function saveMultipleFiles(
  files: (Buffer | File)[],
  options: Omit<SaveFileOptions, 'filename'>
): Promise<string[]> {
  const savedPaths: string[] = [];

  for (const file of files) {
    const path = await saveUploadedFile(file, options);
    savedPaths.push(path);
  }

  return savedPaths;
}

/**
 * Delete an uploaded file
 * @param filePath - The relative path to the file
 */
export async function deleteUploadedFile(filePath: string): Promise<void> {
  try {
    const fs = await import('fs/promises');
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}
