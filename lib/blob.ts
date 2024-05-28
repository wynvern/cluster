export async function postBlob(data: string, type: string) {
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

	return response;
}
