import { decode as jpgDecoder } from "https://esm.sh/jpeg-js@0.4.4";
import { PNG } from "https://esm.sh/pngjs@7.0.0";
import {
  DecoderMap,
  getPixels as getPixelsImpl,
  GetPixelsFunction,
} from "./get-pixels.ts";

export { getDataFromUrl, getFormat } from "./get-pixels.ts";

const decoders: DecoderMap = {
  jpg: jpgDecoder,
  png: (image: Uint8Array) => {
    return new Promise((resolve, reject) => {
      const png = new PNG({ filterType: 4 });
      png.parse(Buffer.from(image), (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          const { width, height, data } = decoded;
          resolve({ width, height, data });
        }
      });
    });
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
