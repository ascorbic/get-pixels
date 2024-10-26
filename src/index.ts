import { decode as jpgDecoder } from "npm:jpeg-js";
// @deno-types="npm:@types/pngjs"
import { PNG } from "npm:pngjs/browser.js";
import {
	DecoderMap,
	getPixels as getPixelsImpl,
	GetPixelsFunction,
} from "./get-pixels.ts";
import { Buffer } from "node:buffer";

export { getDataFromUrl, getFormat } from "./get-pixels.ts";

const decoders: DecoderMap = {
	jpg: (image) => jpgDecoder(image, { useTArray: true }),
	png: (image) => {
		return new Promise((resolve, reject) => {
			const png = new PNG({ filterType: 4 });
			const buf = Buffer.from(image);
			png.parse(buf, (err, decoded) => {
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
