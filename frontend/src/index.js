import React, { useState } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Transactions from "./Components/Transactions";
import Projects from "./Components/Projects";
import Dashboard from "./Components/Dashboard";
import Reports from "./Components/Reports";
import Settings from "./Components/Settings";
import axios from "axios";
import "./index.css";
import "./reset.css";

Modal.setAppElement("#root");
export const tabContext = React.createContext();

const Main = () => {
	const [tab, settab] = useState("dash");
	const [showingForm, setshowingForm] = useState(false);

	const [projectData, setProjectData] = useState({
		projname: "",
		projdate: "",
		projmanager: "",
		projbudget: 0,
	});

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
	};

	const handleChange = (event) => {
		setProjectData({
			...projectData,
			[event.target.name]: event.target.value,
		});
	};
	const addProject = (event) => {
		event.preventDefault();
		const url = "http://localhost:8000/api/projects/add-project/";
		axios
			.post(url, projectData, {
				headers: { "content-type": "multipart/form-data" },
			})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
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
					<Link
						to="/reports"
						style={tab === "repo" ? style2 : style1}
					>
						Reports
					</Link>
					<Link
						to="/projects"
						style={tab === "proj" ? style2 : style1}
						onClick={() => settab("proj")} //remove
					>
						Projects
					</Link>
					<Link
						to="/settings"
						style={tab === "sett" ? style2 : style1}
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
					<button id="projectbutton" onClick={openForm}>
						+ Add
					</button>
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
					<label htmlFor="projbudget">Project Budget: </label>
					<input
						type="number"
						step="any"
						id="projbudget"
						name="projbudget"
						onChange={handleChange}
					/>
					<center>
						<button
							type="submit"
							onClick={addProject}
							id="projsubmit"
						>
							Submit
						</button>
						<input type="reset" />
					</center>
				</form>
				<button onClick={closeForm} id="closeButton">
					&times;
				</button>
			</Modal>
			<tabContext.Provider value={settab}>
				<Switch>
					<Route exact path="/" component={Dashboard} />
					<Route
						exact
						path="/transactions"
						component={Transactions}
					/>
					<Route exact path="/reports" component={Reports} />
					<Route exact path="/projects" component={Projects} />
					<Route exact path="/settings" component={Settings} />
				</Switch>
			</tabContext.Provider>
		</Router>
	);
};

ReactDOM.render(<Main />, document.getElementById("root"));
