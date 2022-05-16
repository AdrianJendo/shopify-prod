import * as React from "react";
import {
	IconButton,
	Tooltip,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import styles from "../styles/Home.module.css";
import axios from "axios";

const rowsPerPage = 50;

export default function InventoryTable({ rows, setRows }) {
	const [page, setPage] = React.useState(0);
	const [edit, setEdit] = React.useState(false);

	const deleteItem = async (item) => {
		const resp = await axios.delete("/api/items", {
			data: {
				item: item.item,
				city: item.city,
			},
		});
		setRows(resp.data.items);
	};

	const columns = [
		{ id: "item", label: "Item", align: "center" },
		{ id: "city", label: "City", align: "center" },
		{ id: "stock", label: "Stock", align: "center" },
		{ id: "weather", label: "Weather", align: "center" },
		{ id: "cancel", label: "", align: "right" },
	];

	columns[columns.length - 1].label = (
		<Tooltip title="Edit" placement="top">
			<IconButton onClick={() => setEdit(!edit)}>
				{edit ? <LockOpenIcon /> : <LockIcon />}
			</IconButton>
		</Tooltip>
	);

	if (edit) {
		for (let i = 0; i < rows.length; ++i) {
			rows[i].cancel = (
				<IconButton
					onClick={() => deleteItem(rows[i])}
					style={{
						padding: "0px 8px",
					}}
				>
					<DeleteForeverIcon />
				</IconButton>
			);
		}
	}

	const handleChangePage = (_, newPage) => {
		setPage(newPage);
	};

	const updateName = (data) => {
		console.log(data);
	};

	return (
		<Paper sx={{ maxHeight: "100%", width: "50%", overflow: "hidden" }}>
			<TableContainer
				sx={{ maxHeight: rows.length > rowsPerPage ? "85%" : "100%" }}
			>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{
										width: column.width,
									}}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							.map((row, index) => {
								return (
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={index}
										sx={{
											height: "70px",
										}}
									>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell
													key={column.id}
													align={column.align}
													className={styles.tableCell}
												>
													{edit &&
													column.id !== "weather" &&
													column.id !== "cancel" ? (
														<TextField
															className={
																styles.tableTextField
															}
															value={value}
															variant="standard"
															onChange={(e) =>
																updateName({
																	newVal: e
																		.target
																		.value,
																	id: column.id,
																	value,
																})
															}
														></TextField>
													) : (
														<Typography>
															{value}
														</Typography>
													)}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			{rows.length > rowsPerPage && (
				<TablePagination
					sx={{ height: "15%" }}
					rowsPerPageOptions={[rowsPerPage]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
				/>
			)}
		</Paper>
	);
}
