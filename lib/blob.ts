interface postBlobResponse {
	urlToMedia: string;
	uuid: string;
	status: string;
}

export async function postBlob(
	data: string,
	type: string
): Promise<postBlobResponse> {
	const apiKey = process.env.BLOB_API_KEY;

	if (!apiKey) {
		throw new Error("BLOB_API_KEY is not defined");
	}

	const response = await fetch(`${process.env.BLOB_URL}/blob/${type}`, {
		body: JSON.stringify({ data }),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: apiKey,
		},
	});

	const responseData = await response.json();

	return responseData;
}
