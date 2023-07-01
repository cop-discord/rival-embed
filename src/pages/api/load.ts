import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const client = createClient({
		url: "redis://23.26.60.58"
	});
	await client.connect();

	const { id } = req.query;

	if (!id) {
		res.status(400).json({ error: "Missing id" });
		return;
	}

	if (Array.isArray(id)) {
		res.status(400).json({ error: "Invalid id" });
		return;
	}

	const value = await client.get(id);

	if (!value) {
		res.status(404).json({ error: "Not found" });
		return;
	}

	res.status(200).json({ embed: JSON.parse(value) });
}
