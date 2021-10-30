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
  AlertTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import "./Transactions.css";
import "../reset.css";
import { tabContext } from "../index";

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
  const { settab, projectId, counter, setCounter } = useContext(tabContext);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("serial");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // const [caller, setCaller] = useState(null);

  const [projectData, setProjectData] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get("http://localhost:8000/api/projects/");
      setProjectData(response.data);
    })();
  }, [projectId, counter]);

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

  const [isOpen, setIsOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formProjectData, setFormProjectData] = useState({});
  const handleChange = (event) => {
    if (event.target.name === "projbudget") {
      if (event.target.value[0] === "-") {
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
  };

  const updateProject = (event) => {
    event.preventDefault();

    if (!showError) {
      console.log(formProjectData);
      const url = "http://localhost:8000/api/projects/modify-project/";
      axios.put(url, formProjectData).catch((error) => {
        console.log(error);
      });
      setCounter(counter + 1);
      closeModal();
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projectData.length) : 0;

  useEffect(() => {
    settab("proj");
  }, [settab]);

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
          {/* CHANGE THIS TOO */}
          {isOpen && (
            <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              closeTimeoutMS={200}
              className="Modal"
              overlayClassName="Overlay"
              ariaHideApp={false}
            >
              <form>
                <center>
                  <h1>Edit Project</h1>
                </center>
                <label htmlFor="projname">Project Name: </label>
                <input
                  type="text"
                  id="projname"
                  name="projname"
                  defaultValue={formProjectData["projname"]}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="projdate">Start Date: </label>
                <input
                  type="date"
                  id="projdate"
                  name="projdate"
                  defaultValue={formProjectData["projdate"].slice(0, 10)}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="projmanager">Project Manager: </label>
                <input
                  type="text"
                  id="projmanager"
                  name="projmanager"
                  defaultValue={formProjectData["projmanager"]}
                  onChange={handleChange}
                  required
                />
                <label
                  htmlFor="projbudget"
                  className={showError ? "labelError" : "tempclass"}
                >
                  Project Budget:{" "}
                </label>
                <input
                  type="number"
                  step="any"
                  id="projbudget"
                  name="projbudget"
                  defaultValue={Number.parseFloat(
                    formProjectData["projbudget"]
                  )}
                  onChange={handleChange}
                  className={showError ? "errorClass" : "tempclass"}
                  required
                />
                {showError && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Enter a positive value for amount!
                  </Alert>
                )}
                <center>
                  <button type="submit" onClick={updateProject} id="projsubmit">
                    Submit
                  </button>
                  <input type="reset" />
                </center>
              </form>
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
                {/* CHANGE THIS */}
                {stableSort(projectData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const date = new Date(row.start_date);
                    let actualmonth = date.getMonth() + 1;
                    let day =
                      date.getDate() >= 10
                        ? date.getDate()
                        : "0" + date.getDate();
                    let month =
                      actualmonth >= 10 ? actualmonth : "0" + actualmonth;
                    const format = day + "/" + month + "/" + date.getFullYear();
                    return (
                      <TableRow key={index}>
                        <TableCell
                          component="th"
                          // id={labelId}
                          scope="row"
                        >
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="center" sx={{ paddingRight: 5 }}>
                          {row.name}
                        </TableCell>
                        <TableCell align="center" sx={{ paddingRight: 5 }}>
                          {format}
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
                                projname: row.name,
                                projdate: row.start_date,
                                projmanager: row.manager,
                                projbudget: row.budget,
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
                                  .catch(() => {
                                    console.error();
                                  });
                                setCounter(counter - 1);
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
