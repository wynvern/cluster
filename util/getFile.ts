"use client";

interface FileAndPreview {
	file: File;
	preview: string;
}

const getFileAndPreview = (
	acceptedTypes: string[]
): Promise<FileAndPreview> => {
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

			// Generate the file's URL for preview
			const preview = URL.createObjectURL(file);

			// Resolve the promise with the File object and the preview URL
			resolve({ file, preview });
		});

		fileInput.click();
	});
};

export default getFileAndPreview;
