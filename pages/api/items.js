import sqlite3 from "sqlite3";
import { DB_NAME, TABLE_NAME } from "constants.js";
import axios from "axios";

const API_KEY = process.env.API_KEY;

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
	const weatherData = {};
	await new Promise(async (resolve) => {
		// get the unique cities
		db.all(
			`SELECT DISTINCT city FROM ${TABLE_NAME};`,
			async (queryErr, cityRows) => {
				if (queryErr) {
					err = queryErr;
				} else {
					const cities = cityRows.map((row) => row.city);

					console.log("C", cities);

					const cityWeatherPromises = cityRows.map((row) =>
						axios.get(
							"https://api.openweathermap.org/data/2.5/weather",
							{
								params: {
									q: `${row.city},ca`,
									appid: API_KEY,
								},
							}
						)
					);

					const cityWeatherResp = await Promise.all(
						cityWeatherPromises
					);

					cityWeatherResp.forEach((resp) => {
						weatherData[resp.data.name] =
							resp.data.weather[0].description;
					});

					db.all(
						`SELECT * FROM ${TABLE_NAME};`,
						function (queryErr, queryRows) {
							if (queryErr) {
								err = queryErr;
							} else {
								rows = queryRows;
							}
							resolve();
						}
					);
				}
			}
		);
	});

	if (err) {
		res.status(500).json({
			msg: "Error querying inventory data",
		});
	} else {
		for (let i = 0; i < rows.length; i++) {
			rows[i].weather = weatherData[rows[i].city];
		}
		res.status(200).json({ items: rows });
	}
};

// Helper to query for inventory item
const findItem = (item, city) => `item='${item}' AND city='${city}'`;

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
	const item = req.body.item;
	const stock = parseInt(req.body.stock) || 0;
	const city = req.body.city;
	if (req.method === "POST") {
		return new Promise((resolve) => {
			db.all(
				`SELECT *
				FROM ${TABLE_NAME}
				WHERE ${findItem(item, city)}
				LIMIT 1;`,
				(queryErr, queryRows) => {
					if (queryErr) {
						res.status(500).json({
							msg: "Error querying database",
						});
					} else {
						const query = queryRows.length
							? `UPDATE ${TABLE_NAME}
						SET stock = ${queryRows[0].stock + stock || 0}
						WHERE ${findItem(item, city)}`
							: `
						INSERT INTO ${TABLE_NAME} (item, city, stock)
										VALUES ('${item}', '${city}' , ${stock || 0});
						`;
						db.exec(query, async (err) => {
							if (err) {
								res.status(500).json({
									msg: "Error inserting into database",
								});
							} else {
								await queryInventories(res);
							}
						});
					}
					resolve();
				}
			);
		});
	} else if (req.method === "PUT") {
	} else if (req.method === "DELETE") {
		return new Promise((resolve) => {
			db.exec(
				`DELETE FROM ${TABLE_NAME}
					WHERE ${findItem(req.body.item, req.body.city)};
				`,
				async (err) => {
					if (err) {
						res.status(500).json({
							msg: "Error deleting from database",
						});
					} else {
						await queryInventories(res);
					}
					resolve();
				}
			);
		});
	} else if (req.method === "GET") {
		await queryInventories(res);
	} else {
		res.status(500).json({ msg: "Method not found" });
	}
}
