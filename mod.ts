import { decode as jpgDecoder } from "jpegts/mod.ts";
import { ColorType, decode as pngDecoder } from "pngs/mod.ts";
import {
	DecoderMap,
	getPixels as getPixelsImpl,
	GetPixelsFunction,
} from "./src/get-pixels.ts";
export { getDataFromUrl, getFormat } from "./src/get-pixels.ts";

function rgbToRgba(
	data: Uint8Array,
	width: number,
	height: number,
): Uint8Array {
	const rgba = new Uint8Array(width * height * 4);
	for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
		rgba[j] = data[i];
		rgba[j + 1] = data[i + 1];
		rgba[j + 2] = data[i + 2];
		rgba[j + 3] = 255;
	}
	return rgba;
}

const decoders: DecoderMap = {
	jpg: jpgDecoder,
	png: (source: Uint8Array) => {
		const { width, height, image, colorType } = pngDecoder(source);
		const data = colorType === ColorType.RGB
			? rgbToRgba(image, width, height)
			: image;
		return {
			width,
			height,
			data,
		};
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
