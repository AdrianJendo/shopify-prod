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

const rowsPerPage = 50;

export default function InventoryTable() {
	const [page, setPage] = React.useState(0);
	const [edit, setEdit] = React.useState(false);

	// const updatePerson = (row, type = "decrement") => {
	// 	const newNumVotes =
	// 		type === "decrement" ? row.numVotes - 1 : row.numVotes + 1;
	// 	const newVoteInfo = Object.assign({}, voteInfo);
	// 	if (newNumVotes === 0) {
	// 		if (stage === "participants") {
	// 			newVoteInfo.numParticipants--;
	// 			if (row.name.includes("New Account")) {
	// 				// only delete the end account and shift the votes up accordingly
	// 				const highestNumAccount = `New Account ${voteInfo.numNewAccounts}`;
	// 				const accountNum = parseInt(row.name[row.name.length - 1]);
	// 				// shift votes up by 1 account
	// 				for (let i = accountNum; i < voteInfo.numNewAccounts; i++) {
	// 					voteInfo.participantData[`New Account ${i}`] =
	// 						voteInfo.participantData[`New Account ${i + 1}`];
	// 				}
	// 				delete newVoteInfo.participantData[highestNumAccount];
	// 				newVoteInfo.numNewAccounts--;
	// 			} else {
	// 				delete newVoteInfo.participantData[row.name];
	// 			}
	// 		} else {
	// 			delete newVoteInfo.candidateData[row.name];
	// 		}
	// 	} else if (stage === "participants") {
	// 		if (type === "decrement") {
	// 			newVoteInfo.participantData[row.name]--;
	// 		} else {
	// 			newVoteInfo.participantData[row.name]++;
	// 		}
	// 	}

	// 	setVoteInfo(newVoteInfo);
	// };

	const columns = [
		{ id: "item", label: "Item", align: "center" },
		{ id: "city", label: "City", align: "center" },
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

	const rows = [
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

	if (edit) {
		for (let i = 0; i < rows.length; ++i) {
			rows[i].cancel = (
				<IconButton
					onClick={() => {
						console.log("click");
					}}
					key={i}
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
										key={row.name}
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
