interface FileBase64Info {
	base64: string;
	preview: string;
}

const getFileBase64 = (
	acceptedTypes: string[],
	maxSize = 4.5
): Promise<FileBase64Info> => {
	return new Promise((resolve, reject) => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = acceptedTypes.map((type) => `.${type}`).join(",");

		fileInput.addEventListener("change", (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (!file) {
				reject(new Error("No file selected."));
				return;
			}

			const fileType = file.type;
			const isAcceptedType = acceptedTypes.some((type) =>
				fileType.includes(type)
			);

			if (file.size > maxSize * 1024 * 1024) {
				console.log(file.size);
				reject(new Error("image-too-big"));
				return;
			}

			if (!isAcceptedType) {
				reject(
					new Error(
						`Invalid file type. Accepted types: ${acceptedTypes.join(
							", "
						)}`
					)
				);
				return;
			}

			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === "string") {
					const [, base64] = reader.result.split(",");
					// Use createObjectURL to generate the file's URL for preview
					const preview = URL.createObjectURL(file);
					resolve({ base64, preview });
				} else {
					reject(new Error("Failed to read file as base64."));
				}
			};
			reader.onerror = (error) => reject(error);
			reader.readAsDataURL(file);
		});

		fileInput.click();
	});
};

export default getFileBase64;
