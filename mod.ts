import { decode as jpgDecoder } from "https://deno.land/x/jpegts@1.1/mod.ts";
import { decode as pngDecoder } from "https://deno.land/x/pngs@0.1.1/mod.ts";
import {
  DecoderMap,
  getPixels as getPixelsImpl,
  GetPixelsFunction,
} from "./src/get-pixels.ts";
export { getDataFromUrl, getFormat } from "./src/get-pixels.ts";

const decoders: DecoderMap = {
  jpg: jpgDecoder,
  png: (image: Uint8Array) => {
    const { width, height, image: data } = pngDecoder(image);
    return { width, height, data };
  },
};

/**
 * Gets the raw pixel data from an image source.
 * The source can be a URL, a string containing the URL, a Uint8Array containing the image data,
 * or an ArrayBuffer containing the image data.
 */
export const getPixels: GetPixelsFunction = (source) => {
  return getPixelsImpl(source, decoders);
};
