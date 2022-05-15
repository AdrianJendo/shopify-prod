const cities = ["Vancouver", "Waterloo", "Toronto", "Montreal", "Edmonton"];

const inventoryItems = [
	{
		id: 1,
		item: "pants",
		city: "Vancouver",
		weather: "rainy",
	},
	{
		id: 2,
		item: "pants",
		city: "Vancouver",
		weather: "rainy",
	},
	{
		id: 3,
		item: "pants",
		city: "Vancouver",
		weather: "rainy",
	},
	{
		id: 4,
		item: "pants",
		city: "Vancouver",
		weather: "rainy",
	},
];

export default function handler(req, res) {
	if (req.method === "POST") {
		// Process a POST request
	} else if (req.method === "PUT") {
		// Handle any other HTTP method
	} else if (req.method === "DELETE") {
	} else if (req.method === "GET") {
		res.status(200).json({ items: inventoryItems });
	} else {
		res.status(500).json({ msg: "Method not found" });
	}
}
