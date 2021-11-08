import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Toolbar,
	Box,
	Typography,
	IconButton,
	Paper,
	Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import "./Transactions.css";
import "../reset.css";
import { tabContext } from "../index";
import { months } from "../utils.js";

function descendingComparator(a, b, orderBy) {
	if (orderBy === "budget") {
		if (parseInt(b[orderBy]) < parseInt(a[orderBy])) {
			return -1;
		}
		if (parseInt(b[orderBy]) > parseInt(a[orderBy])) {
			return 1;
		}
		return 0;
	} else {
		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
		return 0;
	}
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{
		id: "id",
		numeric: false,
		disablePadding: true,
		label: "S.No.",
	},
	{
		id: "name",
		numeric: true,
		disablePadding: false,
		label: "Project Name",
	},
	{
		id: "start_date",
		numeric: true,
		disablePadding: false,
		label: "Project Start Date",
	},
	{
		id: "end_date",
		numeric: true,
		disablePadding: false,
		label: "Project End Date",
	},
	{
		id: "manager",
		numeric: true,
		disablePadding: false,
		label: "Project Manager",
	},
	{
		id: "budget",
		numeric: true,
		disablePadding: false,
		label: "Project Budget",
	},
];

function EnhancedTableHead(props) {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? "center" : "left"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
				<TableCell sx={{ fontFamily: "Manrope", paddingLeft: 3.5 }}>
					Options
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
};

const Projects = () => {
	const { settab, projectId, counter, setCounter, setProjectId } =
		useContext(tabContext);
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("serial");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [projectData, setProjectData] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [showError, setShowError] = useState(false);
	const [formProjectData, setFormProjectData] = useState({});
	const [step, setStep] = useState(1);
	const [showInputError, setShowInputError] = useState(Array(12).fill(false));
	const [currentMonth, setCurrentMonth] = useState(0);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChange = (event) => {
		if (event.target.name === "projectBudget") {
			if (!/^[0-9]+$/.test(event.target.value)) {
				setShowError(true);
			} else {
				setShowError(false);
				setFormProjectData({
					...formProjectData,
					[event.target.name]: event.target.value,
				});
			}
		} else {
			setFormProjectData({
				...formProjectData,
				[event.target.name]: event.target.value,
			});
		}
	};

	const openModal = () => {
		setIsOpen(true);
		setFormProjectData({
			...formProjectData,
			project_id: projectId,
		});
	};

	const closeModal = () => {
		setIsOpen(false);
		setShowError(false);
		setStep(1);
		setShowInputError(Array(12).fill(false));
	};

	const updateProject = (event) => {
		event.preventDefault();
		console.log(formProjectData);
		// if (!showError) {
		// 	const url = "http://localhost:8000/api/projects/modify-project/";
		// 	axios.put(url, formProjectData).catch((error) => {
		// 		console.log(error);
		// 	});
		// 	setCounter(counter + 1);
		// 	closeModal();
		// }
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projectData.length) : 0;

	const formatDate = (input) => {
		const date = new Date(input);
		let actualmonth = date.getMonth() + 1;
		let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
		let month = actualmonth >= 10 ? actualmonth : "0" + actualmonth;
		return day + "/" + month + "/" + date.getFullYear();
	};

	useEffect(() => {
		settab("proj");
	}, [settab]);

	useEffect(() => {
		(async () => {
			const response = await axios.get("http://localhost:8000/api/projects/");
			setProjectData(response.data);
		})();
	}, [projectId, counter]);

	return (
		<Box
			sx={{
				width: "100%",
				marginTop: "2.5%",
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Box sx={{ width: "80%" }}>
				<Paper sx={{ width: "100%", mb: 2 }}>
					<Toolbar
						sx={{
							pl: { sm: 2 },
							pr: { xs: 1, sm: 1 },
						}}
					>
						<Typography
							sx={{ flex: "1 1 100%" }}
							variant="h6"
							id="tableTitle"
							component="div"
						>
							Projects Table
						</Typography>
					</Toolbar>

					{isOpen && (
						<Modal
							isOpen={isOpen}
							onRequestClose={closeModal}
							closeTimeoutMS={200}
							className="Modal"
							overlayClassName="Overlay"
							ariaHideApp={false}
						>
							{step === 1 ? (
								<form>
									<center>
										<h1>Edit Project</h1>
									</center>
									<label htmlFor="projectName">Project Name: </label>
									<input
										type="text"
										id="projectName"
										name="projectName"
										defaultValue={formProjectData["projectName"]}
										onChange={handleChange}
										required
									/>
									<label htmlFor="projectStartDate">Start Date: </label>
									<input
										type="date"
										id="projectStartDate"
										name="projectStartDate"
										defaultValue={formProjectData["projectStartDate"]}
										onChange={handleChange}
										required
									/>
									<label htmlFor="projectEndDate">End Date: </label>
									<input
										type="date"
										id="projectEndDate"
										name="projectEndDate"
										defaultValue={formProjectData["projectEndDate"]}
										onChange={handleChange}
										required
									/>
									<label htmlFor="projectManager">Project Manager: </label>
									<input
										type="text"
										id="projectManager"
										name="projectManager"
										defaultValue={formProjectData["projectManager"]}
										onChange={handleChange}
										required
									/>
									<label
										htmlFor="projectBudget"
										className={showError ? "labelError" : "tempclass"}
									>
										Project Budget:{" "}
									</label>
									<input
										type="number"
										step="any"
										id="projectBudget"
										name="projectBudget"
										defaultValue={Number.parseFloat(
											formProjectData["projectBudget"]
										)}
										onChange={handleChange}
										className={showError ? "errorClass" : "tempclass"}
										required
									/>
									{showError && (
										<Alert severity="error">
											Enter a positive value for amount!
										</Alert>
									)}
									<center>
										<button
											className="next"
											onClick={() => setStep(2)}
											disabled={
												showError ||
												formProjectData["projectBudget"] === "" ||
												isNaN(formProjectData["projectBudget"])
											}
										>
											Next
										</button>
									</center>
								</form>
							) : (
								<form className="form-step-2">
									<center>
										<h1>Remaining Budget:</h1>
										<h1>
											$
											{new Intl.NumberFormat().format(
												Number.parseFloat(formProjectData["projectBudget"]) -
													formProjectData["projectMonthlyBudgets"].reduce(
														(a, b) => (a ? a : 0) + (b ? b : 0),
														0
													)
											)}
										</h1>
										<div className="form-2">
											{(() => {
												let currYear =
													formProjectData["projectStartDate"].split("-")[0];
												let modifiedMonths = [
													...months.slice(
														formProjectData["projectStartDate"].split("-")[1] -
															1,
														12
													),
													...months.slice(
														0,
														formProjectData["projectStartDate"].split("-")[1] -
															1
													),
												];

												for (let i = 0; i < 12; i++) {
													modifiedMonths[i] =
														modifiedMonths[i] + " '" + currYear.slice(2, 4);
													if (modifiedMonths[i].slice(0, 3) === "Dec") {
														currYear = String(+currYear + 1);
													}
												}
												return modifiedMonths;
											})().map((month, index) => (
												<div className="month-inputs" key={index}>
													<label
														className={
															showInputError[index]
																? "labelError2"
																: "month-class"
														}
														htmlFor={month}
													>
														{month}
													</label>
													<input
														className={
															showInputError[index]
																? "errorClass2"
																: "month-class"
														}
														name="month-input"
														type="text"
														defaultValue={
															formProjectData["projectMonthlyBudgets"][
																+formProjectData["projectStartDate"].split(
																	"-"
																)[1] -
																	currentMonth +
																	index <
																0
																	? +formProjectData["projectStartDate"].split(
																			"-"
																	  )[1] -
																	  currentMonth +
																	  index +
																	  12
																	: +formProjectData["projectStartDate"].split(
																			"-"
																	  )[1] -
																			currentMonth +
																			index >=
																	  12
																	? +formProjectData["projectStartDate"].split(
																			"-"
																	  )[1] -
																	  currentMonth +
																	  index -
																	  12
																	: +formProjectData["projectStartDate"].split(
																			"-"
																	  )[1] -
																	  currentMonth +
																	  index
															]
																? formProjectData["projectMonthlyBudgets"][
																		+formProjectData["projectStartDate"].split(
																			"-"
																		)[1] -
																			currentMonth +
																			index <
																		0
																			? +formProjectData[
																					"projectStartDate"
																			  ].split("-")[1] -
																			  currentMonth +
																			  index +
																			  12
																			: +formProjectData[
																					"projectStartDate"
																			  ].split("-")[1] -
																					currentMonth +
																					index >=
																			  12
																			? +formProjectData[
																					"projectStartDate"
																			  ].split("-")[1] -
																			  currentMonth +
																			  index -
																			  12
																			: +formProjectData[
																					"projectStartDate"
																			  ].split("-")[1] -
																			  currentMonth +
																			  index
																  ]
																: 0
														}
														min="0"
														onChange={(event) => {
															if (
																event.target.validity.badInput ||
																!/^[0-9]*$/.test(event.target.value)
															) {
																let temp = showInputError;
																temp[index] = true;
																setShowInputError(temp);
															} else {
																let temp = showInputError;
																temp[index] = false;
																setShowInputError(temp);
															}
															let temp = [
																...formProjectData["projectMonthlyBudgets"],
															];
															temp[index] = parseInt(
																event.target.value ? event.target.value : 0
															);
															setFormProjectData(() => ({
																...formProjectData,
																projectMonthlyBudgets: temp,
															}));
														}}
													/>
												</div>
											))}
										</div>
										<button className="back" onClick={() => setStep(1)}>
											Back
										</button>
										<button
											type="submit"
											onClick={updateProject}
											id="projectSubmit"
											disabled={
												!showInputError.every((e) => e === false) ||
												formProjectData["projectMonthlyBudgets"].every(
													(e) => e === 0
												) ||
												Number.parseFloat(formProjectData["projectBudget"]) -
													formProjectData["projectMonthlyBudgets"].reduce(
														(a, b) => (a ? a : 0) + (b ? b : 0),
														0
													) <
													0
											}
										>
											Submit
										</button>
									</center>
								</form>
							)}
							<button onClick={closeModal} id="closeButton">
								&times;
							</button>
						</Modal>
					)}

					<TableContainer>
						<Table
							sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
							size={"medium"}
						>
							<EnhancedTableHead
								order={order}
								orderBy={orderBy}
								onRequestSort={handleRequestSort}
							/>
							<TableBody>
								{stableSort(projectData, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										return (
											<TableRow key={index}>
												<TableCell component="th" scope="row">
													{page * rowsPerPage + index + 1}
												</TableCell>
												<TableCell align="center" sx={{ paddingRight: 5 }}>
													{row.name}
												</TableCell>
												<TableCell align="center" sx={{ paddingRight: 5 }}>
													{formatDate(row.start_date)}
												</TableCell>
												<TableCell align="center" sx={{ paddingRight: 5 }}>
													{formatDate(row.end_date)}
												</TableCell>
												<TableCell align="center" sx={{ paddingRight: 5 }}>
													{row.manager}
												</TableCell>
												<TableCell align="center" sx={{ paddingRight: 5 }}>
													${new Intl.NumberFormat().format(row.budget)}
												</TableCell>
												<TableCell>
													<IconButton
														onClick={() => {
															openModal();
															setFormProjectData({
																id: row.id,
																projectName: row.name,
																projectStartDate: row.start_date,
																projectEndDate: row.end_date,
																projectManager: row.manager,
																projectBudget: row.budget,
																projectMonthlyBudgets: row.monthly_budget,
															});
															setCurrentMonth(+row.start_date.split("-")[1]);
														}}
													>
														<EditIcon
															sx={{
																opacity: "70%",
															}}
														/>
													</IconButton>
													<IconButton
														onClick={() => {
															if (
																window.confirm(
																	"Are you sure you want to delete?"
																)
															) {
																axios
																	.delete(
																		"http://localhost:8000/api/projects/modify-project/",
																		{
																			data: {
																				id: row.id,
																			},
																		}
																	)
																	.then(async () => {
																		const response = await axios.get(
																			"http://localhost:8000/api/projects/"
																		);
																		setProjectData(response.data);
																		setProjectId(projectData[0].id);
																	})
																	.catch(() => {
																		console.error();
																	});
															}
														}}
													>
														<DeleteIcon
															sx={{
																opacity: "70%",
															}}
														/>
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								{emptyRows > 0 && (
									<TableRow
										style={{
											height: 53 * emptyRows,
										}}
									>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={projectData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
		</Box>
	);
};

export default Projects;
