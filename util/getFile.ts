export interface FileBase64Info {
	base64: string;
	preview: string;
	fileType: string;
	file: File;
}

export default function getFileBase64(
	acceptedTypes: string[],
	maxSize = 5
): Promise<FileBase64Info> {
	return new Promise((resolve, reject) => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = acceptedTypes.map((type) => `.${type}`).join(",");

		fileInput.addEventListener("change", (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (!file) {
				reject(new Error("no-file-selected"));
				return;
			}

			const fileType = file.type;
			const isAcceptedType = acceptedTypes.some((type) =>
				fileType.includes(type)
			);

			if (file.size > maxSize * 1024 * 1024) {
				reject(new Error("file-too-large"));
				return;
			}

			if (!isAcceptedType) {
				reject(new Error("invalid-file-type"));
				return;
			}

			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === "string") {
					const [, base64] = reader.result.split(",");

					const preview = URL.createObjectURL(file);
					const fileType = file.type;

					resolve({
						base64,
						preview,
						fileType,
						file,
					});
				} else {
					reject(new Error("cant-read-base64"));
				}
			};

			reader.readAsDataURL(file);
		});

		fileInput.click();
	});
}
