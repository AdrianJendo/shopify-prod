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

// Helper function for querying database
const queryInventories = async (res) => {
	let rows;
	let err = undefined;
	await new Promise((resolve) => {
		db.all(`SELECT * FROM ${TABLE_NAME};`, function (queryErr, queryRows) {
			if (queryErr) {
				err = queryErr;
			} else {
				rows = queryRows;
			}
			resolve();
		});
	});
	if (err) {
		res.status(500).json({
			msg: "Error get inventory data",
		});
	} else {
		res.status(200).json({ items: rows });
	}
};

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
				async (err) => {
					if (err) {
						res.status(500).json({
							msg: "Error inserting into database",
						});
						resolve();
					} else {
						await queryInventories(res);
					}
				}
			);
		});
	} else if (req.method === "PUT") {
	} else if (req.method === "DELETE") {
		const deleteQuery = `item='${req.body.item}' AND city='${req.body.city}'`;
		console.log(deleteQuery);
		return new Promise((resolve) => {
			db.exec(
				`DELETE FROM ${TABLE_NAME}
					WHERE ${deleteQuery};
				`,
				async (err) => {
					if (err) {
						res.status(500).json({
							msg: "Error deleting from database",
						});
						resolve();
					} else {
						await queryInventories(res);
					}
				}
			);
		});
	} else if (req.method === "GET") {
		await queryInventories(res);
	} else {
		res.status(500).json({ msg: "Method not found" });
	}
}
