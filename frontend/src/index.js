import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Transactions from "./Components/Transactions";
import Projects from "./Components/Projects";
import Dashboard from "./Components/Dashboard";
import Reports from "./Components/Reports";
import Settings from "./Components/Settings";
import "./index.css";
import "./reset.css";

const Main = () => {
  const [tab, settab] = useState("dash");
  const style1 = { textDecoration: "none", color: "white" };
  const style2 = {
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    borderBottom: "1px solid white",
    paddingBottom: "3px",
  };
  return (
    <Router>
      <div id="navbar">
        <div id="navleft">
          <h6>Project Budget Tracker</h6>
          <Link
            to="/"
            style={tab === "dash" ? style2 : style1}
            onClick={() => settab("dash")}
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            style={tab === "tran" ? style2 : style1}
            onClick={() => settab("tran")}
          >
            Transactions
          </Link>
          <Link
            to="/reports"
            style={tab === "repo" ? style2 : style1}
            onClick={() => settab("repo")}
          >
            Reports
          </Link>
          <Link
            to="/projects"
            style={tab === "proj" ? style2 : style1}
            onClick={() => settab("proj")}
          >
            Projects
          </Link>
          <Link
            to="/settings"
            style={tab === "sett" ? style2 : style1}
            onClick={() => settab("sett")}
          >
            Settings
          </Link>
        </div>
        <div id="navright">
          <select id="projectselect">
            <option value="Project 1">Project 1</option>
            <option value="Project 2">Project 2</option>
            <option value="Project 3">Project 3</option>
          </select>
          <button id="projectbutton">+ Add Project</button>
        </div>
      </div>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/transactions" component={Transactions} />
        <Route exact path="/reports" component={Reports} />
        <Route exact path="/projects" component={Projects} />
        <Route exact path="/settings" component={Settings} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
