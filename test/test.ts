import { assertEquals, assertRejects } from "jsr:@std/assert";

import { getFormat, getPixels } from "../mod.ts";

const pngData = await Deno.readFile(new URL("test.png", import.meta.url));
const jpgData = await Deno.readFile(new URL("test.jpg", import.meta.url));
const invalidData = await Deno.readFile(new URL("test.webp", import.meta.url));

const pngUrl =
	"https://images.unsplash.com/photo-1674255909399-9bcb2cab6489?fm=png&w=80&h=60&fit=crop";
const jpgUrl =
	"https://images.unsplash.com/photo-1674255909399-9bcb2cab6489?fm=jpg&w=80&h=60&fit=crop";
const webpUrl =
	"https://images.unsplash.com/photo-1674255909399-9bcb2cab6489?fm=webp&w=80&h=60&fit=crop";

Deno.test("format detection", async (t) => {
	await t.step("png", () => {
		const format = getFormat(pngData);
		assertEquals(format, "png");
	});

	await t.step("jpg", () => {
		const format = getFormat(jpgData);
		assertEquals(format, "jpg");
	});

	await t.step("invalid", () => {
		const format = getFormat(invalidData);
		assertEquals(format, undefined);
	});
});

Deno.test("parsing", async (t) => {
	await t.step("png", async () => {
		const image = await getPixels(pngData);
		assertEquals(image.width, 80);
		assertEquals(image.height, 60);
		assertEquals(image.data.length, 80 * 60 * 4);
	});

	await t.step("jpg", async () => {
		const pixels = await getPixels(jpgData);
		assertEquals(pixels.width, 80);
		assertEquals(pixels.height, 60);
		assertEquals(pixels.data.length, 80 * 60 * 4);
	});
});

Deno.test("url", async (t) => {
	await t.step("png", async () => {
		const image = await getPixels(pngUrl);
		assertEquals(image.width, 80);
		assertEquals(image.height, 60);
		assertEquals(image.data.length, 80 * 60 * 4);
	});

	await t.step("jpg", async () => {
		const pixels = await getPixels(jpgUrl);
		assertEquals(pixels.width, 80);
		assertEquals(pixels.height, 60);
		assertEquals(pixels.data.length, 80 * 60 * 4);
	});

	await t.step("invalid", async () => {
		await assertRejects(
			() => getPixels(webpUrl),
			Error,
			"Unsupported format",
		);
	});
});
