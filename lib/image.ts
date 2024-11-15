import sharp from "sharp";

export async function squareImage(buffer: Buffer): Promise<Buffer> {
	try {
		const metadata = await sharp(buffer).metadata();

		if (metadata.width && metadata.height) {
			const processedImage = await sharp(buffer)
				.png({ quality: 20 })
				.withMetadata()
				.resize({
					width: 300,
					height: 300,
					fit: "cover",
					position: "centre",
				})
				.toBuffer();

			return processedImage;
		}
		throw new Error("Some metadata is missing.");
	} catch (error) {
		console.error("Error processing image:", error);
		throw error;
	}
}

export async function compressImage(buffer: Buffer): Promise<Buffer> {
	try {
		const metadata = await sharp(buffer).metadata();
		const processedImage = await sharp(buffer)
			.png({ quality: 20 })
			.withMetadata()
			.toBuffer();

		return processedImage;
	} catch (error) {
		console.error("Error processing image:", error);
		throw error;
	}
}
