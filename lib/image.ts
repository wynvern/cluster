import sharp from "sharp";

export async function squareImage(buffer: Buffer): Promise<Buffer> {
	try {
		const metadata = await sharp(buffer).metadata();

		if (metadata.width && metadata.height) {
			const processedImage = await sharp(buffer)
				.png({ compressionLevel: 9 }) // Convert to PNG format
				.withMetadata() // Keep image metadata (e.g., orientation)
				.resize({
					width: 500,
					height: 500,
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

		if (metadata.width && metadata.height) {
			const processedImage = await sharp(buffer)
				.png({ compressionLevel: 9 }) // Convert to PNG format
				.withMetadata() // Keep image metadata (e.g., orientation)
				.toBuffer();

			return processedImage;
		}
		throw new Error("Some metadata is missing.");
	} catch (error) {
		console.error("Error processing image:", error);
		throw error;
	}
}
