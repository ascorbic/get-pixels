# 🌈 🦕`@unpic/pixels`

**Load and decode the pixels for a PNG or JPEG image**

This module will take the raw data or URL of a PNG or JPEG image and return the
decoded pixels and dimensions of the image.

## Usage

```ts
import { getPixels } from "jsr:@unpic/pixels";

// From a URL
const { width, height, data } = await getPixels(
	"https://placecats.com/100/100",
);

// From a file

const file = await Deno.readFile("kitten.png");

const { width, height, data } = await getPixels(file);
```

There is also a `getFormat` function that will return the format of the image
data. This is detected by the first magic bytes at the start of the data.

```ts
import { getFormat } from "jsr:@unpic/pixels";

const file = await Deno.readFile("kitten.png");
const format = getFormat(file);
// format === "png"
```

## License

© 2023-2024 [Matt Kane](https://github.com/ascorbic). This project is MIT
licensed.
