import { decode as jpgDecoder } from "https://deno.land/x/jpegts@1.1/mod.ts";
import { decode as pngDecoder } from "https://deno.land/x/pngs@0.1.1/mod.ts";

export type ImageFormat = "jpg" | "png";

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
export function decodeImageData(imageData: Uint8Array): ImageData {
  const format = getFormat(imageData);
  switch (format) {
    case "jpg": {
      const { width, height, data } = jpgDecoder(imageData);
      return { width, height, data };
    }
    case "png": {
      const { width, height, image } = pngDecoder(imageData);
      return { width, height, data: image };
    }
    default:
      throw new Error("Unsupported format");
  }
}

export async function getDataFromUrl(url: string | URL): Promise<Uint8Array> {
  const response = await fetch(url);
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
): Promise<ImageData> {
  if (source instanceof URL || typeof source === "string") {
    const data = await getDataFromUrl(source);
    return decodeImageData(data);
  } else if (source instanceof Uint8Array) {
    return decodeImageData(source);
  } else {
    return decodeImageData(new Uint8Array(source));
  }
}
