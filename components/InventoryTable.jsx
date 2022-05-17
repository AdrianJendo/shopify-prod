import React, { useState } from "react";
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
	Modal,
	Box,
	Button,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { CITIES } from "constants";

const rowsPerPage = 50;

export default function InventoryTable({ rows, setRows }) {
	const [page, setPage] = useState(0);
	const [edit, setEdit] = useState(false);
	const [modalValue, setModalValue] = useState(null);

	const deleteItem = async (item) => {
		const resp = await axios.delete("/api/items", {
			data: {
				item: item.item.toLowerCase(),
				city: item.city,
			},
		});
		setRows(resp.data.items);
	};

	const editItem = async (item) => {
		setModalValue({
			oldItem: item.item,
			oldCity: item.city,
			oldStock: item.stock,
			newItem: item.item,
			newCity: item.city,
			newStock: item.stock,
		});
	};

	const updateRow = async () => {
		if (
			modalValue.newItem !== modalValue.oldItem ||
			modalValue.newStock !== modalValue.oldStock ||
			modalValue.newCity !== modalValue.oldCity
		) {
			const resp = await axios.put("/api/items", {
				data: {
					newItem: modalValue.newItem,
					oldItem: modalValue.oldItem,
					newStock: modalValue.newStock,
					newCity: modalValue.newCity,
					oldCity: modalValue.oldCity,
				},
			});
			console.log(resp.data);
			setRows(resp.data.items);
			setModalValue(null);
		}
	};

	const columns = [
		{ id: "item", label: "Item", align: "center" },
		{ id: "city", label: "City", align: "center" },
		{ id: "stock", label: "Stock", align: "center" },
		{ id: "weather", label: "Weather", align: "center" },
		{ id: "editRow", label: "", align: "right" },
		{ id: "deleteRow", label: "", align: "right" },
	];

	columns[columns.length - 1].label = (
		<Tooltip title="Edit" placement="top">
			<IconButton onClick={() => setEdit(!edit)}>
				{edit ? <LockOpenIcon /> : <LockIcon />}
			</IconButton>
		</Tooltip>
	);

	const handleChangePage = (_, newPage) => {
		setPage(newPage);
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
													(column.id === "editRow" ||
														column.id ===
															"deleteRow") ? (
														column.id ===
														"editRow" ? (
															<Tooltip
																title="Edit Row"
																placement="top"
															>
																<IconButton
																	onClick={() =>
																		editItem(
																			row
																		)
																	}
																	style={{
																		padding:
																			"0px 8px",
																	}}
																>
																	<SettingsIcon />
																</IconButton>
															</Tooltip>
														) : (
															<Tooltip
																title="Remove Row"
																placement="top"
															>
																<IconButton
																	onClick={() =>
																		deleteItem(
																			row
																		)
																	}
																	style={{
																		padding:
																			"0px 8px",
																	}}
																>
																	<DeleteForeverIcon />
																</IconButton>
															</Tooltip>
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

			<Modal open={modalValue !== null}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						border: "2px solid #000",
						boxShadow: 24,
						p: 4,
					}}
				>
					<Typography
						variant="h6"
						component="h2"
						className={styles.buttonContainer}
					>
						Edit Row
					</Typography>
					{modalValue !== null && (
						<div className={styles.textContainer}>
							<TextField
								className={styles.textField}
								id="item"
								label="Item"
								variant="standard"
								value={modalValue.newItem}
								onChange={(e) =>
									setModalValue({
										...modalValue,
										newItem: e.target.value.toLowerCase(),
									})
								}
							/>
							<TextField
								className={styles.textField}
								id="stock"
								label="Stock"
								variant="standard"
								value={modalValue.newStock}
								onChange={(e) => {
									if (!isNaN(e.target.value)) {
										setModalValue({
											...modalValue,

											newStock: e.target.value || 0,
										});
									}
								}}
							/>
							<FormControl
								sx={{ width: "200px", margin: "0 20px" }}
							>
								<InputLabel>City</InputLabel>
								<Select
									value={modalValue.newCity}
									label="Age"
									onChange={(e) =>
										setModalValue({
											...modalValue,
											newCity: e.target.value,
										})
									}
								>
									{CITIES.map((city) => (
										<MenuItem value={city} key={city}>
											{city}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
					)}
					<div className={styles.buttonContainer}>
						<Button
							onClick={() => updateRow()}
							sx={{ padding: "20px" }}
						>
							Confirm changes
						</Button>
						<Button
							onClick={() => setModalValue(null)}
							sx={{ padding: "20px" }}
						>
							Cancel changes
						</Button>
					</div>
				</Box>
			</Modal>

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
