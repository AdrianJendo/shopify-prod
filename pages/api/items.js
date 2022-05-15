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

let idCount = 5;

export default function handler(req, res) {
	if (req.method === "POST") {
		inventoryItems.push({
			id: idCount++,
			item: req.body.item,
			city: req.body.city,
			weather: "TDB",
		});
		res.status(200).json({ items: inventoryItems });
	} else if (req.method === "PUT") {
	} else if (req.method === "DELETE") {
		const deleteId = req.body.id;
		const deleteIndex = inventoryItems.findIndex((e) => e.id === deleteId);
		inventoryItems.splice(deleteIndex, 1);
		res.status(200).json({ items: inventoryItems });
	} else if (req.method === "GET") {
		res.status(200).json({ items: inventoryItems });
	} else {
		res.status(500).json({ msg: "Method not found" });
	}
}
