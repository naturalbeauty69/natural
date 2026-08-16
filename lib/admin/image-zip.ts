export interface ZipImageEntry {
  path: string;
  fileName: string;
  lowerName: string;
  compressionMethod: number;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
}

export interface ZipImageIndex {
  file: File;
  bytes: Uint8Array;
  entries: Map<string, ZipImageEntry>;
}

const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "webp", "gif", "avif", "bmp", "svg",
]);

const textDecoder = new TextDecoder();

function readUint16(view: DataView, offset: number) {
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number) {
  return view.getUint32(offset, true);
}

function normalizeFileName(name: string): string {
  return name.replace(/\\/g, "/").split("/").pop()?.trim().toLowerCase() ?? "";
}

function isImageFile(path: string): boolean {
  const fileName = normalizeFileName(path);
  const extension = fileName.split(".").pop() ?? "";
  return IMAGE_EXTENSIONS.has(extension);
}

function findEndOfCentralDirectory(bytes: Uint8Array): number {
  const minimum = 22;
  const maxComment = 0xffff;
  const start = Math.max(0, bytes.length - minimum - maxComment);
  for (let i = bytes.length - minimum; i >= start; i -= 1) {
    if (
      bytes[i] === 0x50 &&
      bytes[i + 1] === 0x4b &&
      bytes[i + 2] === 0x05 &&
      bytes[i + 3] === 0x06
    ) {
      return i;
    }
  }
  throw new Error("Invalid ZIP: end-of-central-directory record not found.");
}

export async function indexImageZip(file: File): Promise<ZipImageIndex> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = findEndOfCentralDirectory(bytes);
  const entryCount = readUint16(view, eocd + 10);
  const centralSize = readUint32(view, eocd + 12);
  const centralOffset = readUint32(view, eocd + 16);

  if (centralOffset + centralSize > bytes.length) {
    throw new Error("Invalid ZIP: central directory is outside the archive.");
  }

  const entries = new Map<string, ZipImageEntry>();
  let cursor = centralOffset;

  for (let i = 0; i < entryCount; i += 1) {
    if (cursor + 46 > bytes.length || readUint32(view, cursor) !== 0x02014b50) {
      throw new Error("Invalid ZIP: malformed central directory entry.");
    }

    const flags = readUint16(view, cursor + 8);
    const compressionMethod = readUint16(view, cursor + 10);
    const compressedSize = readUint32(view, cursor + 20);
    const uncompressedSize = readUint32(view, cursor + 24);
    const fileNameLength = readUint16(view, cursor + 28);
    const extraLength = readUint16(view, cursor + 30);
    const commentLength = readUint16(view, cursor + 32);
    const localHeaderOffset = readUint32(view, cursor + 42);

    if (
      compressedSize === 0xffffffff ||
      uncompressedSize === 0xffffffff ||
      localHeaderOffset === 0xffffffff
    ) {
      throw new Error("ZIP64 archives are not supported. Please use a standard ZIP file.");
    }

    const nameStart = cursor + 46;
    const nameBytes = bytes.slice(nameStart, nameStart + fileNameLength);
    let path = textDecoder.decode(nameBytes);
    if ((flags & 0x0800) === 0) {
      // Most business-generated ZIPs use UTF-8 or ASCII. Decode as UTF-8 when
      // the UTF-8 flag is absent rather than guessing a locale-specific code page.
      path = textDecoder.decode(nameBytes);
    }

    const lowerName = normalizeFileName(path);
    if (lowerName && !path.endsWith("/") && isImageFile(path)) {
      entries.set(lowerName, {
        path,
        fileName: path.split("/").pop() || path,
        lowerName,
        compressionMethod,
        compressedSize,
        uncompressedSize,
        localHeaderOffset,
      });
    }

    cursor += 46 + fileNameLength + extraLength + commentLength;
  }

  return { file, bytes, entries };
}

export async function extractZipImage(
  archive: ZipImageIndex,
  entry: ZipImageEntry
): Promise<File> {
  const bytes = archive.bytes;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (entry.localHeaderOffset + 30 > bytes.length || readUint32(view, entry.localHeaderOffset) !== 0x04034b50) {
    throw new Error(`Invalid ZIP local header for ${entry.fileName}.`);
  }

  const fileNameLength = readUint16(view, entry.localHeaderOffset + 26);
  const extraLength = readUint16(view, entry.localHeaderOffset + 28);
  const dataStart = entry.localHeaderOffset + 30 + fileNameLength + extraLength;
  const dataEnd = dataStart + entry.compressedSize;

  if (dataEnd > bytes.length) {
    throw new Error(`Invalid ZIP data range for ${entry.fileName}.`);
  }

  const compressed = bytes.slice(dataStart, dataEnd);
  let output: Uint8Array;

  if (entry.compressionMethod === 0) {
    output = compressed;
  } else if (entry.compressionMethod === 8) {
    const streamCtor = (globalThis as typeof globalThis & {
      DecompressionStream?: new (format: string) => any;
    }).DecompressionStream;

    if (!streamCtor) {
      throw new Error("This browser does not support ZIP deflate extraction. Try a modern Chrome, Edge, Firefox, or Safari.");
    }

    const stream = new Blob([compressed]).stream().pipeThrough(new streamCtor("deflate-raw"));
    output = new Uint8Array(await new Response(stream).arrayBuffer());
  } else {
    throw new Error(`Unsupported ZIP compression method for ${entry.fileName}.`);
  }

  const extension = entry.fileName.split(".").pop()?.toLowerCase() || "bin";
  const contentType =
    extension === "jpg" || extension === "jpeg" ? "image/jpeg" :
    extension === "png" ? "image/png" :
    extension === "webp" ? "image/webp" :
    extension === "gif" ? "image/gif" :
    extension === "avif" ? "image/avif" :
    extension === "svg" ? "image/svg+xml" :
    extension === "bmp" ? "image/bmp" :
    "application/octet-stream";

  return new File([output], entry.fileName, { type: contentType });
}
