import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
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
  Tooltip,
  IconButton,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Modal from "react-modal";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import "./Transactions.css";
import "../reset.css";
import { tabContext } from "../index";

const data = [
  ["Cupcake", 305, 3.7, 67, 4.3],
  ["Donut", 452, 25.0, 51, 4.9],
  ["Eclair", 262, 16.0, 24, 6.0],
];

const rows = data.map((element) => {
  return {
    name: element[0],
    calories: element[1],
    fat: element[2],
    carbs: element[3],
    protein: element[4],
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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "S.No.",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Transaction Name",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Transaction Amount",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Transaction Date",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Transaction Type",
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
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, projectId, transactionCounter, setTransactionCounter } =
    props;
  const [transactionType, setTransactionType] = useState("Architect");
  const [transactionData, setTransactionData] = useState({
    "transaction-name": "",
    "transaction-type": "",
    "transaction-amount": 0,
    "transaction-date": "",
    project_id: projectId,
  });
  const [isopen, setisopen] = useState(false);
  const openModal = () => {
    setisopen(true);
    setTransactionData({ ...transactionData, project_id: projectId });
  };
  const closeModal = () => {
    setisopen(false);
  };

  const handleChange = (event) => {
    setTransactionData({
      ...transactionData,
      [event.target.name]: event.target.value,
    });
  };

  const handleTransactionType = (event) => {
    setTransactionType(event.target.value);
    handleChange(event);
  };

  const addTransaction = (event) => {
    event.preventDefault();
    const url = "http://localhost:8000/api/projects/add-transaction/";
    axios
      .post(url, transactionData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    setTransactionCounter(transactionCounter + 1);
    closeModal();
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Transaction Table
        </Typography>
      )}
      <Modal
        isOpen={isopen}
        onRequestClose={closeModal}
        closeTimeoutMS={200}
        className="Modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <form>
          <center>
            <h1>Add a Transaction</h1>
          </center>
          <label htmlFor="transaction-name">Transaction Name: </label>
          <input
            type="text"
            id="transaction-name"
            name="transaction-name"
            onChange={handleChange}
            required
          />
          <label htmlFor="transaction-date">Transaction Date: </label>
          <input
            type="date"
            id="transaction-date"
            name="transaction-date"
            onChange={handleChange}
            required
          />
          <label htmlFor="transaction-type">Type of Transaction: </label>
          <select
            type="text"
            id="transaction-type"
            name="transaction-type"
            value={transactionType}
            onChange={handleTransactionType}
            required
          >
            <option value="Architect">Architect</option>
            <option value="DBA">DBA</option>
            <option value="Technical Lead">Technical Lead</option>
            <option value="Developer">Developer</option>
            <option value="Business Analyst">Business Analyst</option>
            <option value="Tester">Tester</option>
            <option value="Networking and Security">
              Networking and Security
            </option>
            <option value="Travel Expenses">Travel Expenses</option>
            <option value="Hardware Costs">Hardware Costs</option>
            <option value="Software Costs">Software Costs</option>
            <option value="Stationery">Stationery</option>
            <option value="Training">Training</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
          <label htmlFor="transaction-amount">Transaction Amount: </label>
          <input
            type="number"
            step="any"
            id="transaction-amount"
            name="transaction-amount"
            onChange={handleChange}
            required
          />
          <center>
            <button
              type="submit"
              onClick={addTransaction}
              id="transaction-submit"
            >
              Submit
            </button>
            <input type="reset" />
          </center>
        </form>
        <button onClick={closeModal} id="closeButton">
          &times;
        </button>
      </Modal>
      <Tooltip title="Add Transaction">
        <IconButton onClick={openModal}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Transactions = () => {
  const { settab, projectId, counter } = useContext(tabContext);
  const [transactionCounter, setTransactionCounter] = React.useState(0);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [transactionData, setTransactionData] = useState([]);
  useEffect(async () => {
    const response = await axios.get(
      `http://localhost:8000/api/project/${projectId}/transactions`
    );
    setTransactionData(response.data);

    console.log(response.data);
  }, [projectId, counter, transactionCounter]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  useEffect(() => {
    settab("tran");
  }, [settab]);

  return (
    <Container>
      <Box sx={{ width: "100%", marginTop: "5%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            projectId={projectId}
            transactionCounter={transactionCounter}
            setTransactionCounter={setTransactionCounter}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(transactionData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const date = new Date(row.date);
                    const format =
                      date.getDate() +
                      "/" +
                      date.getMonth() +
                      "/" +
                      date.getFullYear();

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">
                          ${new Intl.NumberFormat().format(row.amount)}
                        </TableCell>
                        <TableCell align="center">{format}</TableCell>
                        <TableCell align="center">{row.type}</TableCell>
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

export default Transactions;
