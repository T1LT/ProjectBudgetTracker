import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
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
  Container,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import "./Transactions.css";
import "../reset.css";
import { tabContext } from "../index";
import TransactionModal from "./TransactionModal";

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
    id: "serial",
    numeric: false,
    disablePadding: true,
    label: "S.No.",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Transaction Name",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Transaction Amount",
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Transaction Date",
  },
  {
    id: "type",
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

const Transactions = () => {
  const { settab, projectId, counter } = useContext(tabContext);
  const [transactionCounter, setTransactionCounter] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("serial");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [transactionData, setTransactionData] = useState([]);

  const [caller, setCaller] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:8000/api/project/${projectId}/transactions`
      );
      setTransactionData(response.data);
    })();
  }, [projectId, counter, transactionCounter]);

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

  const [transactionType, setTransactionType] = useState("Architect");
  const [formTransactionData, setFormTransactionData] = useState({
    "transaction-name": "",
    "transaction-type": "",
    "transaction-amount": 0,
    "transaction-date": "",
    project_id: projectId,
  });
  const [isopen, setisopen] = useState(false);
  const [showError, setShowError] = useState(false);

  const openModal = () => {
    setisopen(true);
    setFormTransactionData({
      ...formTransactionData,
      project_id: projectId,
    });
  };
  const closeModal = () => {
    setisopen(false);
    setShowError(false);
  };

  const handleTransaction = (event) => {
    event.preventDefault();

    if (!showError) {
      const url = "http://localhost:8000/api/projects/add-transaction/";
      console.log(caller);

      if (caller === "Edit") {
        axios.put(url, formTransactionData).catch((error) => {
          console.log(error);
        });
      } else {
        axios.post(url, formTransactionData).catch((error) => {
          console.log(error);
        });
      }
      setTransactionCounter(transactionCounter + 1);
      closeModal();
    }
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - transactionData.length)
      : 0;

  useEffect(() => {
    settab("tran");
  }, [settab]);

  return (
    <Container>
      <Box sx={{ width: "100%", marginTop: "5%" }}>
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
              Transaction Table
            </Typography>
            <TransactionModal
              isOpen={isopen}
              closeModal={closeModal}
              transactionType={transactionType}
              setTransactionType={setTransactionType}
              formTransactionData={formTransactionData}
              setFormTransactionData={setFormTransactionData}
              handleTransaction={handleTransaction}
              showError={showError}
              setShowError={setShowError}
              caller={caller}
            />
            <IconButton
              onClick={() => {
                openModal();
                setCaller("Add");
              }}
              sx={{ borderRadius: 0, color: "black" }}
            >
              <AddIcon />
              <Typography>Add Transaction</Typography>
            </IconButton>
          </Toolbar>
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
                {stableSort(transactionData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const date = new Date(row.date);
                    let month = date.getMonth() + 1;
                    const format =
                      date.getDate() + "/" + month + "/" + date.getFullYear();
                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell align="center" sx={{ paddingRight: 5 }}>
                          {row.name}
                        </TableCell>
                        <TableCell align="center" sx={{ paddingRight: 5 }}>
                          ${new Intl.NumberFormat().format(row.amount)}
                        </TableCell>
                        <TableCell align="center" sx={{ paddingRight: 5 }}>
                          {format}
                        </TableCell>
                        <TableCell align="center" sx={{ paddingRight: 5 }}>
                          {row.type}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              openModal();
                              setCaller("Edit");
                              setFormTransactionData({
                                "transaction-id": row.id,
                                "transaction-name": row.name,
                                "transaction-type": row.type,
                                "transaction-amount": row.amount,
                                "transaction-date": row.date,
                                project_id: projectId,
                              });
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
                              axios
                                .delete(
                                  "http://localhost:8000/api/projects/add-transaction/",
                                  {
                                    data: {
                                      "transaction-id": row.id,
                                    },
                                  }
                                )
                                .catch(() => {
                                  console.error();
                                });
                              setTransactionCounter(transactionCounter + 1);
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
            count={transactionData.length}
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
