export type ImageFormat = "jpg" | "png";

export interface Decoder {
  (data: Uint8Array): ImageData | Promise<ImageData>;
}

export type DecoderMap = { [key in ImageFormat]: Decoder };

/**
 * Detect the format of the image. Returns undefined if the format is not supported.
 */
export function getFormat(data: Uint8Array): ImageFormat | undefined {
  // https://en.wikipedia.org/wiki/List_of_file_signatures

  if (data[0] === 0xff && data[1] === 0xd8) {
    return "jpg";
  }
  if (data[0] === 0x89 && data[1] === 0x50) {
    return "png";
  }
}

export interface ImageData {
  // The width of the image in pixels.
  width: number;
  // The height of the image in pixels.
  height: number;
  // The raw pixel data of the image.
  data: Uint8Array;
}

/**
 * Decodes JPEG or PNG image data into a raw Uint8Array pixel array.
 */
export function decodeImageData(
  imageData: Uint8Array,
  decoders: DecoderMap,
): ImageData | Promise<ImageData> {
  const format = getFormat(imageData);
  if (format && format in decoders) {
    return decoders[format](imageData);
  }
  throw new Error("Unsupported format");
}

export async function getDataFromUrl(url: string | URL): Promise<Uint8Array> {
  const response = await fetch(url, {
    headers: { Accept: "image/jpeg,image/png,*/*" },
  });
  const data = await response.arrayBuffer();
  return new Uint8Array(data);
}

/**
 * Gets the raw pixel data from an image source.
 * The source can be a URL, a string containing the URL, a Uint8Array containing the image data,
 * or an ArrayBuffer containing the image data.
 */
export async function getPixels(
  source: URL | string | Uint8Array | ArrayBuffer,
  decoders: DecoderMap,
): Promise<ImageData> {
  if (source instanceof URL || typeof source === "string") {
    const data = await getDataFromUrl(source);
    return decodeImageData(data, decoders);
  } else if (source instanceof Uint8Array) {
    return decodeImageData(source, decoders);
  } else {
    return decodeImageData(new Uint8Array(source), decoders);
  }
}

export type GetPixelsFunction = (
  source: URL | string | Uint8Array | ArrayBuffer,
) => Promise<ImageData>;
