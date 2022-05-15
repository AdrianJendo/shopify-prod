import Head from "next/head";
import styles from "../styles/Home.module.css";
import InventoryTable from "components/InventoryTable";

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Inventory Tracker</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				{/* <link rel="icon" href="/shop.png" /> */}
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Inventory Tracker</h1>
				<div style={{ display: "inline-block" }}>
					<input type="text"></input>
					<input type="text"></input>
					<button>Add Item (Item, city)</button>
				</div>
				<div>Table, columns are name, city, weather</div>
				<InventoryTable />
			</main>
		</div>
	);
}
