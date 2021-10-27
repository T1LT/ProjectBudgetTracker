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
import { Alert, AlertTitle } from "@mui/material";
import { months } from "./utils.js";

Modal.setAppElement("#root");
export const tabContext = React.createContext();

const Main = () => {
  const [tab, settab] = useState("dash");
  const [showingForm, setshowingForm] = useState(false);
  const [projectId, setProjectId] = useState(1);
  const [counter, setCounter] = useState(0);
  const [projectNames, setProjectNames] = useState({});
  const [showError, setShowError] = useState(false);
  const [step, setStep] = useState(1);
  const [monthBudget, setMonthBudget] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [projectData, setProjectData] = useState({
    projname: "",
    projdate: "",
    projmanager: "",
    projbudget: 0,
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
    setStep(1);
    setMonthBudget([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  };

  const handleChange = (event) => {
    if (event.target.name === "projbudget") {
      if (event.target.value[0] === "-") {
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
      axios
        .post(url, projectData)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      setCounter(counter + 1);
      closeForm();
    }
  };

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
            onClick={() => settab("tran")} //remove
          >
            Transactions
          </Link>
          <Link to="/reports" style={tab === "repo" ? style2 : style1}>
            Reports
          </Link>
          <Link
            to="/projects"
            style={tab === "proj" ? style2 : style1}
            onClick={() => settab("proj")} //remove
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
          <form>
            <center>
              <h1>Add a Project</h1>
            </center>
            <label htmlFor="projname">Project Name: </label>
            <input
              type="text"
              id="projname"
              name="projname"
              onChange={handleChange}
              required
            />
            <label htmlFor="projdate">Start Date: </label>
            <input
              type="date"
              id="projdate"
              name="projdate"
              onChange={handleChange}
              required
            />
            <label htmlFor="projmanager">Project Manager: </label>
            <input
              type="text"
              id="projmanager"
              name="projmanager"
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
              <button className="next" onClick={() => setStep(2)}>
                Next
              </button>
              <button type="reset" value="Reset">
                Reset
              </button>
            </center>
          </form>
        ) : (
          <form>
            <center>
              <h1>
                Total Budget:{" "}
                {projectData["projbudget"] -
                  monthBudget.reduce((a, b) => (a ? a : 0) + (b ? b : 0), 0)}
              </h1>
              {months.map((month, index) => (
                <div className="month-inputs" key={index}>
                  <label htmlFor={month}>{month}</label>
                  <input
                    type="number"
                    defaultValue={monthBudget[index]}
                    onChange={(event) => {
                      let temp = [...monthBudget];
                      temp[index] = parseInt(event.target.value);
                      setMonthBudget(temp);
                    }}
                  />
                </div>
              ))}
              <button className="back" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="submit" onClick={addProject} id="projsubmit">
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
            id="projectselect"
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
      <tabContext.Provider value={{ settab, projectId, counter, setCounter }}>
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
