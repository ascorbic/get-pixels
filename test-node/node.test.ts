import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts";
import { getDataFromUrl, getFormat, getPixels } from "../src/index.ts";
import { encode } from "https://esm.sh/blurhash@2.0.4";

Deno.test("Size detection", async () => {
  const jpgData = await getPixels(
    "https://res.cloudinary.com/demo/image/upload/c_lfill,w_200,h_100/dog.jpg",
  );
  assertEquals(jpgData.width, 200);
  assertEquals(jpgData.height, 100);

  const pngData = await getPixels(
    "https://res.cloudinary.com/demo/image/upload/c_lfill,w_200,h_100/dog.png",
  );
  assertEquals(pngData.width, 200);
  assertEquals(pngData.height, 100);
});

Deno.test("Format detection", async () => {
  const jpgFormat = getFormat(
    await getDataFromUrl(
      "https://res.cloudinary.com/demo/image/upload/c_lfill,w_200,h_100/dog.jpg",
    ),
  );
  assertEquals(jpgFormat, "jpg");

  const pngFormat = getFormat(
    await getDataFromUrl(
      "https://res.cloudinary.com/demo/image/upload/c_lfill,w_200,h_100/dog.png",
    ),
  );
  assertEquals(pngFormat, "png");
});

Deno.test("Blurhash", async () => {
  const jpgData = await getPixels(
    "https://res.cloudinary.com/demo/image/upload/c_lfill,w_200,h_100/dog.jpg",
  );
  const data = Uint8ClampedArray.from(jpgData.data);
  const blurhash = encode(data, jpgData.width, jpgData.height, 4, 4);
  assertEquals(blurhash, "UAFih,Im00-?QD$+NKE100xv~EM^cENEs+?H");

  const pngData = await getPixels(
    "https://res.cloudinary.com/demo/image/upload/c_lfill,w_200,h_100/dog.png",
  );

  const data2 = Uint8ClampedArray.from(pngData.data);
  const blurhash2 = encode(data2, pngData.width, pngData.height, 4, 4);
  assertEquals(blurhash2, "UAFs3YIm00-?QD$+NKE100xv~EMwcENEs+?H");
});
