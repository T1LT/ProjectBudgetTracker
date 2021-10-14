import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import React, { useContext, useEffect } from "react";
import { tabContext } from "../index";
import { visuallyHidden } from "@mui/utils";
import { Container } from "@mui/material";
import "./Projects.css";
import "../reset.css";

const data = [
	["Cupcake", 305, 3.7, 67, 4.3],
	["Donut", 452, 25.0, 51, 4.9],
	["Eclair", 262, 16.0, 24, 6.0],
];

const rows = data.map((element) => {
	return {
		projectId: element[0],
		projectName: element[1],
		projectDate: element[2],
		projectManager: element[3],
		projectBudget: element[4],
	};
});

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
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
		id: "project-id",
		numeric: false,
		disablePadding: true,
		label: "Project ID",
	},
	{
		id: "project-name",
		numeric: true,
		disablePadding: false,
		label: "Project Name",
	},
	{
		id: "project-date",
		numeric: true,
		disablePadding: false,
		label: "Project Start Date",
	},
	{
		id: "project-manager",
		numeric: true,
		disablePadding: false,
		label: "Project Manager",
	},
	{
		id: "project-budget",
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
				<TableCell padding="checkbox"></TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? "right" : "left"}
						padding={headCell.disablePadding ? "none" : "normal"}
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
									{order === "desc"
										? "sorted descending"
										: "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
	return (
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
				Project Table
			</Typography>
		</Toolbar>
	);
};

const Projects = () => {
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const { settab, projectId } = useContext(tabContext);
	useEffect(() => {
		settab("proj");
	}, [settab]);

	return (
		<Container>
			<Box sx={{ width: "100%" }}>
				<Paper sx={{ width: "100%", mb: 2 }}>
					<EnhancedTableToolbar />
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
								{stableSort(rows, getComparator(order, orderBy))
									.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									)
									.map((row, index) => {
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												role="checkbox"
												tabIndex={-1}
												key={row.name}
											>
												<TableCell padding="checkbox">
													<Checkbox
														color="primary"
														inputProps={{
															"aria-labelledby":
																labelId,
														}}
													/>
												</TableCell>
												<TableCell
													component="th"
													id={labelId}
													scope="row"
													padding="none"
												>
													{row.projectId}
												</TableCell>
												<TableCell align="right">
													{row.projectName}
												</TableCell>
												<TableCell align="right">
													{row.projectDate}
												</TableCell>
												<TableCell align="right">
													{row.projectManager}
												</TableCell>
												<TableCell align="right">
													{row.projectBudget}
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
										<TableCell colSpan={5} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={rows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
		</Container>
	);
};

export default Projects;
