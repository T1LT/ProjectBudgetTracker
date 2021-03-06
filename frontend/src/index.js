import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Transactions from "./Components/Transactions";
import Projects from "./Components/Projects";
import Dashboard from "./Components/Dashboard";
import Reports from "./Components/Reports";
import axios from "axios";
import "./index.css";
import "./reset.css";
import { Alert } from "@mui/material";
import { months, addOneYear, _months, subtractOneYear } from "./utils.js";

Modal.setAppElement("#root");
export const tabContext = React.createContext();

const Main = () => {
  const [tab, settab] = useState("dash");
  const [showingForm, setshowingForm] = useState(false);
  const [projectId, setProjectId] = useState(1);
  const [counter, setCounter] = useState(0);
  const [projectNames, setProjectNames] = useState({});
  const [showError, setShowError] = useState(false);
  const [showInputError, setShowInputError] = useState(Array(12).fill(false));
  const [step, setStep] = useState(1);
  const [monthBudget, setMonthBudget] = useState({});
  const [projectData, setProjectData] = useState({
    projectName: "",
    projectStartDate: "",
    projectEndDate: "",
    projectManager: "",
    projectBudget: 0,
    projectMonthlyBudgets: monthBudget,
  });

  useEffect(() => {
    (async () => {
      const url = `http://localhost:8000/api/projects/names/`;
      const response = await axios.get(url);
      const allProjects = response.data;
      setProjectNames(allProjects);
      let p = localStorage.getItem("projectId");
      if (p) {
        setProjectId(p);
      }
    })();
  }, [counter]);

  const style1 = { textDecoration: "none", color: "white" };
  const style2 = {
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    borderBottom: "1px solid white",
    paddingBottom: "3px",
  };
  const openForm = () => {
    setshowingForm(true);
  };
  const closeForm = () => {
    setshowingForm(false);
    setShowError(false);
    setShowInputError(Array(12).fill(false));
    setStep(1);
    setMonthBudget({});
    setProjectData({
      projectName: "",
      projectStartDate: "",
      projectEndDate: "",
      projectManager: "",
      projectBudget: 0,
      projectMonthlyBudgets: monthBudget,
    });
  };

  const handleChange = (event) => {
    if (
      event.target.name === "projectBudget" ||
      event.target.name === "projectStartDate" ||
      event.target.name === "projectEndDate"
    ) {
      setProjectData((prevState) => ({
        ...prevState,
        projectMonthlyBudgets: {},
      }));
      setMonthBudget({});
    }
    if (event.target.name === "projectBudget") {
      if (!/^[0-9]+$/.test(event.target.value)) {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }
    setProjectData({
      ...projectData,
      [event.target.name]: event.target.value,
    });
  };

  const addProject = (event) => {
    event.preventDefault();
    if (!showError) {
      const url = "http://localhost:8000/api/projects/modify-project/";
      axios.post(url, projectData).catch((error) => {
        console.log(error);
      });
      setCounter(counter - 1);
      closeForm();
    }
  };

  const remainingBudget =
    projectData["projectBudget"] -
    Object.values(monthBudget).reduce((a, b) => (a ? a : 0) + (b ? b : 0), 0);

  const handleProjectId = (event) => {
    setProjectId(event.target.value);
    localStorage.setItem("projectId", event.target.value);
  };
  return (
    <Router>
      <div id="navbar">
        <div id="navleft">
          <h6>Project Budget Tracker</h6>
          <Link to="/" style={tab === "dash" ? style2 : style1}>
            Dashboard
          </Link>
          <Link
            to="/transactions"
            style={tab === "tran" ? style2 : style1}
            onClick={() => settab("tran")}
          >
            Transactions
          </Link>
          <Link to="/reports" style={tab === "repo" ? style2 : style1}>
            Reports
          </Link>
          <Link
            to="/projects"
            style={tab === "proj" ? style2 : style1}
            onClick={() => settab("proj")}
          >
            Projects
          </Link>
        </div>
      </div>
      <Modal
        isOpen={showingForm}
        onRequestClose={closeForm}
        closeTimeoutMS={200}
        className="Modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        {step === 1 ? (
          <form
            className="form-step-1"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <center>
              <h1 className="project-h1">Add a Project</h1>
            </center>
            <label htmlFor="projectName">Project Name: </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={projectData["projectName"]}
              onChange={handleChange}
              required
            />
            <label htmlFor="projectStartDate">Start Date: </label>
            <input
              type="date"
              id="projectStartDate"
              name="projectStartDate"
              value={projectData["projectStartDate"]}
              min={subtractOneYear(projectData["projectEndDate"])}
              max={projectData["projectEndDate"]}
              onChange={handleChange}
              onKeyDown={(e) => e.preventDefault()}
              required
            />
            <label htmlFor="projectEndDate">End Date: </label>
            <input
              type="date"
              id="projectEndDate"
              name="projectEndDate"
              min={projectData["projectStartDate"]}
              max={addOneYear(projectData["projectStartDate"])}
              value={projectData["projectEndDate"]}
              onChange={handleChange}
              onKeyDown={(e) => e.preventDefault()}
              required
            />
            <label htmlFor="projectManager">Project Manager: </label>
            <input
              type="text"
              id="projectManager"
              name="projectManager"
              value={projectData["projectManager"]}
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
              defaultValue={
                projectData["projectBudget"] ? projectData["projectBudget"] : ""
              }
              onChange={handleChange}
              className={showError ? "errorClass" : "tempclass"}
              required
            />
            {showError && (
              <Alert severity="error">Enter a positive value for amount!</Alert>
            )}
            <center>
              <button
                type="reset"
                onClick={() =>
                  setProjectData({
                    projectName: "",
                    projectStartDate: "",
                    projectEndDate: "",
                    projectManager: "",
                    projectBudget: 0,
                    projectMonthlyBudgets: [Array(12).fill(0)],
                  })
                }
              >
                Reset
              </button>
              <button
                className="next"
                onClick={() => setStep(2)}
                disabled={
                  projectData["projectName"] === "" ||
                  projectData["projectStartDate"] === "" ||
                  projectData["projectEndDate"] === "" ||
                  projectData["projectManager"] === "" ||
                  projectData["projectBudget"] === "" ||
                  projectData["projectBudget"] === 0 ||
                  showError
                }
              >
                Next
              </button>
            </center>
          </form>
        ) : (
          <form
            className="form-step-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <center>
              <h1>Remaining Budget:</h1>
              <h1>${new Intl.NumberFormat().format(remainingBudget)}</h1>
              <div className="form-2">
                {(() => {
                  const start = projectData["projectStartDate"];
                  const end = projectData["projectEndDate"];
                  let startDate = new Date(start);
                  let endDate = new Date(end);
                  let startMonth = startDate.getMonth();
                  let endMonth = endDate.getMonth();
                  let modifiedMonths;
                  let currentYear = startDate.getFullYear();
                  if (endMonth - startMonth > 0) {
                    modifiedMonths = [
                      ...months.slice(startMonth, endMonth + 1),
                    ];
                  } else {
                    if (
                      endMonth === startMonth &&
                      currentYear === endDate.getFullYear()
                    ) {
                      modifiedMonths = [months[startMonth]];
                    } else {
                      modifiedMonths = [
                        ...months.slice(startMonth, 12),
                        ...months.slice(0, endMonth + 1),
                      ];
                    }
                  }
                  modifiedMonths = modifiedMonths.map((e) => {
                    let x = e + " '" + currentYear.toString().substr(-2);
                    if (e === "Dec") {
                      currentYear += 1;
                    }
                    return x;
                  });
                  return modifiedMonths;
                })().map((month, index) => (
                  <div className="month-inputs" key={index}>
                    <label
                      className={
                        showInputError[index] ? "labelError2" : "month-class"
                      }
                      htmlFor={month}
                    >
                      {month}
                    </label>
                    <input
                      className={
                        showInputError[index] ? "errorClass2" : "month-class"
                      }
                      name="month-input"
                      type="text"
                      value={
                        monthBudget[_months[month.slice(0, 3)]]
                          ? Math.abs(monthBudget[_months[month.slice(0, 3)]])
                          : 0
                      }
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        if (event.target.value === "") {
                          event.target.value = 0;
                        }
                        if (
                          event.target.validity.badInput ||
                          !/^[0-9]\d*(\.\d+)?$/.test(event.target.value)
                        ) {
                          let temp = showInputError;
                          temp[index] = true;
                          setShowInputError(temp);
                        } else {
                          let temp = showInputError;
                          temp[index] = false;
                          setShowInputError(temp);
                        }
                        let temp = { ...monthBudget };
                        temp[_months[month.slice(0, 3)]] = parseFloat(
                          event.target.value ? event.target.value : 0
                        );
                        setMonthBudget(temp);
                        setProjectData(() => ({
                          ...projectData,
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
                onClick={addProject}
                id="projectSubmit"
                disabled={
                  !showInputError.every((e) => e === false) ||
                  remainingBudget !== 0
                }
              >
                Submit
              </button>
            </center>
          </form>
        )}
        <button onClick={closeForm} id="closeButton">
          &times;
        </button>
      </Modal>
      <center>
        <div id="projectdiv">
          <select
            id={tab === "proj" ? "hideprojectselect" : "projectselect"}
            value={projectId}
            onChange={handleProjectId}
          >
            {Object.keys(projectNames).map((project) => (
              <option key={project} value={project}>
                {projectNames[project]}
              </option>
            ))}
          </select>
          <div className="multi-button">
            <button id="projectbutton" className="cut" onClick={openForm}>
              + Add Project
            </button>
          </div>
        </div>
      </center>
      <tabContext.Provider
        value={{ settab, projectId, counter, setCounter, setProjectId }}
      >
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/transactions" component={Transactions} />
          <Route exact path="/reports" component={Reports} />
          <Route exact path="/projects" component={Projects} />
        </Switch>
      </tabContext.Provider>
    </Router>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
