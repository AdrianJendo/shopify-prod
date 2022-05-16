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
	InputLabel,
	MenuItem,
	FormControl,
	Select,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { CITIES } from "constants";

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

	const handleChangePage = (_, newPage) => {
		setPage(newPage);
	};

	const updateCell = ({ id, index, newVal }) => {
		const newRows = rows.slice();
		if (id === "item" || id === "city") {
			newRows[index][id] = newVal;
		} else if (id === "stock" && !isNaN(newVal)) {
			newRows[index][id] = parseInt(newVal) || 0;
		}
		setRows(newRows);
	};

	const handleToggleEdit = async () => {
		if (edit) {
			const resp = await axios.put("/api/items", {
				data: {
					rows: rows.map((row) => ({
						city: row.city,
						item: row.item,
						stock: row.stock,
					})),
				},
			});
			console.log(resp);
		}
		setEdit(!edit);
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
			<IconButton onClick={() => handleToggleEdit()}>
				{edit ? <LockOpenIcon /> : <LockIcon />}
			</IconButton>
		</Tooltip>
	);

	if (edit) {
		for (let i = 0; i < rows.length; ++i) {
			rows[i].cancel = (
				<Tooltip title="Remove Row" placement="top">
					<IconButton
						onClick={() => deleteItem(rows[i])}
						style={{
							padding: "0px 8px",
						}}
					>
						<DeleteForeverIcon />
					</IconButton>
				</Tooltip>
			);
		}
	}

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
														column.id === "city" ? (
															<FormControl
																sx={{
																	width: "150px",
																	margin: "0 20px",
																	height: "30px",
																}}
															>
																<InputLabel>
																	City
																</InputLabel>
																<Select
																	value={
																		row.city
																	}
																	label="Age"
																	onChange={(
																		e
																	) =>
																		updateCell(
																			{
																				id: column.id,
																				index,
																				newVal: e
																					.target
																					.value,
																			}
																		)
																	}
																	sx={{
																		height: "30px",
																	}}
																>
																	{CITIES.map(
																		(
																			city
																		) => (
																			<MenuItem
																				value={
																					city
																				}
																				key={
																					city
																				}
																			>
																				{
																					city
																				}
																			</MenuItem>
																		)
																	)}
																</Select>
															</FormControl>
														) : (
															<TextField
																className={
																	styles.tableTextField
																}
																value={value}
																variant="standard"
																onChange={(e) =>
																	updateCell({
																		id: column.id,
																		index,
																		newVal: e
																			.target
																			.value,
																	})
																}
															></TextField>
														)
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
