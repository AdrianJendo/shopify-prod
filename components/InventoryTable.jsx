import * as React from "react";
import { VoteInfoContext } from "context/VoteInfoContext";
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
} from "@mui/material";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PlusOneIcon from "@mui/icons-material/PlusOne";

const rowsPerPage = 50;

export default function StickyHeadTable({ stage }) {
	const [page, setPage] = React.useState(0);
	const [voteInfo, setVoteInfo] = React.useContext(VoteInfoContext);

	const updatePerson = (row, type = "decrement") => {
		const newNumVotes =
			type === "decrement" ? row.numVotes - 1 : row.numVotes + 1;
		const newVoteInfo = Object.assign({}, voteInfo);
		if (newNumVotes === 0) {
			if (stage === "participants") {
				newVoteInfo.numParticipants--;
				if (row.name.includes("New Account")) {
					// only delete the end account and shift the votes up accordingly
					const highestNumAccount = `New Account ${voteInfo.numNewAccounts}`;
					const accountNum = parseInt(row.name[row.name.length - 1]);
					// shift votes up by 1 account
					for (let i = accountNum; i < voteInfo.numNewAccounts; i++) {
						voteInfo.participantData[`New Account ${i}`] =
							voteInfo.participantData[`New Account ${i + 1}`];
					}
					delete newVoteInfo.participantData[highestNumAccount];
					newVoteInfo.numNewAccounts--;
				} else {
					delete newVoteInfo.participantData[row.name];
				}
			} else {
				delete newVoteInfo.candidateData[row.name];
			}
		} else if (stage === "participants") {
			if (type === "decrement") {
				newVoteInfo.participantData[row.name]--;
			} else {
				newVoteInfo.participantData[row.name]++;
			}
		}

		setVoteInfo(newVoteInfo);
	};

	const columns = [
		{ id: "item", label: "Item" },
		{ id: "city", label: "City" },
		{ id: "weather", label: "Weather" },
	];

	columns[columns.length - 1].label = (
		<Tooltip title="Edit" placement="top">
			<IconButton
				onClick={() =>
					setVoteInfo({
						...voteInfo,
						activeStep: stage === "participants" ? 0 : 1,
					})
				}
			>
				<SettingsBackupRestoreIcon />
			</IconButton>
		</Tooltip>
	);

	const rows = [];
	const fakeData = [];
	if (stage === "participants" && voteInfo.participantData) {
		for (const [name, numVotes] of Object.entries(
			voteInfo.participantData
		)) {
			rows.push({
				name,
				numVotes,
				add:
					voteInfo.activeStep === 4 ? (
						""
					) : (
						<IconButton
							onClick={() =>
								updatePerson({ numVotes, name }, "increment")
							}
						>
							<PlusOneIcon />
						</IconButton>
					),
				cancel:
					voteInfo.activeStep === 4 ? (
						""
					) : (
						<IconButton
							onClick={() => updatePerson({ numVotes, name })}
						>
							<PersonRemoveIcon />
						</IconButton>
					),
			});
		}
	} else if (stage === "candidates" && voteInfo.candidateData) {
		Object.keys(voteInfo.candidateData).forEach((name) => {
			rows.push({
				name,
				cancel:
					voteInfo.activeStep === 4 ? (
						""
					) : (
						<IconButton
							onClick={() => updatePerson({ numVotes: 1, name })}
						>
							<PersonRemoveIcon />
						</IconButton>
					),
			});
		});
	}

	const handleChangePage = (_, newPage) => {
		setPage(newPage);
	};

	return (
		<Paper sx={{ maxHeight: "100%", width: "100%", overflow: "hidden" }}>
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
									>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell
													key={column.id}
													align={column.align}
												>
													{column.format &&
													typeof value === "number"
														? column.format(value)
														: value}
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
