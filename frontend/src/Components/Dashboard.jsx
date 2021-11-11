import React, { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "./Dashboard.css";
import { tabContext } from "../index";
import axios from "axios";
import { CircularProgress, Card, CardContent } from "@mui/material";

const Dashboard = () => {
	const { settab, projectId } = useContext(tabContext);

	const [data, setData] = useState({});
	const [labels, setLabels] = useState([]);
	const [chartData, setChartData] = useState([]);
	const [loader, setLoader] = useState(0);
	/* loader = {0 - loading, 1 - projects, 2 - no projects} */

	useEffect(() => {
		(() => {
			let temp1 = [];
			let temp2 = [];
			let apiData = {
				expenses: {},
			};
			const url = `http://localhost:8000/api/project/${projectId}/`;
			axios
				.get(url)
				.then((response) => {
					apiData = response.data;
					setData(apiData);
					setLabels([]);
					setChartData([]);
					Object.keys(apiData["expenses"]).map((expense) => {
						if (apiData["expenses"][expense] !== 0) {
							temp1.push(expense);
							temp2.push(apiData["expenses"][expense]);
						}
						return null;
					});
					setLabels(temp1);
					setChartData(temp2);
					setLoader(1);
				})
				.catch((error) => {
					console.log(error.response.status);
					if (error.response.status === 500) {
						setLoader(2);
					} else {
						setLoader(0);
					}
				});
		})();
	}, [projectId]);

	useEffect(() => {
		settab("dash");
	}, [settab]);

	return (
		<>
			{loader === 0 && (
				<div
					style={{
						height: "70vh",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<CircularProgress />
				</div>
			)}
			{loader === 1 && (
				<div id="dash">
					<div id="left">
						<Card
							variant="outlined"
							sx={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								boxShadow: 2,
							}}
						>
							<CardContent sx={{ display: "grid", placeItems: "center" }}>
								<h2 id="totaltext">Total Budget</h2>
								<h1 id="totalamt">
									${new Intl.NumberFormat().format(data["budget"])}
								</h1>
								<h2 id="inctext">Incurred Expenses</h2>
								<h1 id="incamt">
									${new Intl.NumberFormat().format(data["incurred_expenses"])}
								</h1>
							</CardContent>
						</Card>
						<Card
							variant="outlined"
							sx={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								boxShadow: 2,
							}}
						>
							<CardContent sx={{ display: "grid", placeItems: "center" }}>
								<h1
									id={
										data["monthly_budget_sum"] - data["incurred_expenses"] < 0
											? "erroramt"
											: "cvamt"
									}
								>
									$
									{new Intl.NumberFormat().format(
										Math.round(
											data["monthly_budget_sum"] - data["incurred_expenses"]
										)
									)}
								</h1>
								<h2 id="cvtext">Cost Variance</h2>
							</CardContent>
						</Card>
						<Card
							variant="outlined"
							sx={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								boxShadow: 2,
							}}
						>
							<CardContent sx={{ display: "grid", placeItems: "center" }}>
								<h1
									id={
										data["monthly_budget_sum"] / data["incurred_expenses"] < 1
											? "erroramt"
											: "cpiamt"
									}
								>
									{(
										data["monthly_budget_sum"] / data["incurred_expenses"]
									).toFixed(2)}
								</h1>
								<h2 id="cpitext">Cost Performance Index</h2>
							</CardContent>
						</Card>
						<Card
							variant="outlined"
							sx={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								boxShadow: 2,
							}}
						>
							<CardContent sx={{ display: "grid", placeItems: "center" }}>
								<h1 id="percentamt">
									{((data["incurred_expenses"] / data["budget"]) * 100).toFixed(
										2
									)}
									%
								</h1>
								<h2 id="percenttext">spent</h2>
							</CardContent>
						</Card>
						<Card
							variant="outlined"
							sx={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								boxShadow: 2,
							}}
						>
							<CardContent sx={{ display: "grid", placeItems: "center" }}>
								<h1 id="eacamt">
									$
									{new Intl.NumberFormat().format(
										Math.round(
											data["budget"] /
												(data["monthly_budget_sum"] / data["incurred_expenses"])
										)
									)}
								</h1>
								<h2 id="eactext">Estimate at Completion</h2>
							</CardContent>
						</Card>
						<Card
							variant="outlined"
							sx={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								boxShadow: 2,
							}}
						>
							<CardContent sx={{ display: "grid", placeItems: "center" }}>
								<h1
									id={
										data["budget"] -
											data["budget"] /
												(data["monthly_budget_sum"] /
													data["incurred_expenses"]) <
										0
											? "erroramt"
											: "vacamt"
									}
								>
									$
									{new Intl.NumberFormat().format(
										Math.round(
											data["budget"] -
												data["budget"] /
													(data["monthly_budget_sum"] /
														data["incurred_expenses"])
										)
									)}
								</h1>
								<h2 id="vactext">Variance at Completion</h2>
							</CardContent>
						</Card>
					</div>
					<div id="right">
						{data["incurred_expenses"] ? (
							<Doughnut
								id="donut"
								data={{
									labels: [...labels],
									datasets: [
										{
											data: [...chartData],
											fill: true,
											backgroundColor: [
												"rgb(255, 99, 132)",
												"rgb(54, 162, 235)",
												"rgb(255, 205, 86)",
												"rgb(75, 192, 192)",
												"rgb(255, 159, 64)",
												"rgb(153, 102, 255)",
												"rgb(201, 203, 2)",
											],
										},
									],
								}}
							/>
						) : (
							<p className="no-data">Add transactions to render the graph.</p>
						)}
					</div>
				</div>
			)}
			{loader === 2 && (
				<div>
					<center>
						<h1>Add a project to get started.</h1>
					</center>
				</div>
			)}
		</>
	);
};

export default Dashboard;
