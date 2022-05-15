import sqlite3 from "sqlite3";
import { DB_NAME, TABLE_NAME, CITIES } from "constants.js";

// Helper function for creating db
const createDatabase = () => {
	const newdb = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.log("Getting error " + err);
			exit(1);
		}
		newdb.exec(
			`
			CREATE TABLE ${TABLE_NAME} (
				item TEXT NOT NULL,
				city TEXT NOT NULL,
				stock INTEGER NOT NULL,
				PRIMARY KEY (item, city)
			);
			INSERT INTO ${TABLE_NAME} (item, city, stock)
				VALUES ('Pants', 'Vancouver', 100),
					('Clothes', 'Toronto', 200),
					('Shoes', 'Montreal', 0);
				`
		);
	});
};

const inventoryItems = [];

// Connect to db
const db = new sqlite3.Database(DB_NAME, sqlite3.OPEN_READWRITE, (err) => {
	if (err && err.code == "SQLITE_CANTOPEN") {
		createDatabase();
		return;
	} else if (err) {
		console.log("Getting error " + err);
		exit(1);
	}
});

export default async function handler(req, res) {
	if (req.method === "POST") {
		const insertValues = `('${req.body.item}', '${req.body.city}' , ${
			req.body.stock || 0
		})`;
		return new Promise((resolve) => {
			db.exec(
				`INSERT INTO ${TABLE_NAME} (item, city, stock)
						VALUES ${insertValues};
					`,
				(err) => {
					if (err) {
						res.status(500).json({ msg: err });
						resolve();
					} else {
						db.all(
							`SELECT * FROM ${TABLE_NAME};`,
							function (err, rows) {
								if (err) {
									res.status(500).json({ msg: err });
								} else {
									res.status(200).json({ items: rows });
								}
								resolve();
							}
						);
					}
				}
			);
		});
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
