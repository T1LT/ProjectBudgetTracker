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
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			let temp1 = [];
			let temp2 = [];
			const url = `http://localhost:8000/api/project/${projectId}/`;
			const response = await axios.get(url);
			const apiData = response.data;
			setData(apiData);
			setIsLoading(false);
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
		})();
	}, [projectId]);

	useEffect(() => {
		settab("dash");
	}, [settab]);

	return (
		<>
			{!isLoading ? (
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
									${new Intl.NumberFormat().format(data.budget)}
								</h1>
								<h2 id="inctext">Incurred Expenses</h2>
								<h1 id="incamt">
									${new Intl.NumberFormat().format(data.incurred_expenses)}
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
								<h1 id="cvamt">
									{((data.incurred_expenses / data.budget) * 100).toFixed(2)}%
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
								<h1 id="cpiamt">
									{((data.incurred_expenses / data.budget) * 100).toFixed(2)}%
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
									{((data.incurred_expenses / data.budget) * 100).toFixed(2)}%
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
									{((data.incurred_expenses / data.budget) * 100).toFixed(2)}%
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
								<h1 id="vacamt">
									{((data.incurred_expenses / data.budget) * 100).toFixed(2)}%
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
			) : (
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
		</>
	);
};

export default Dashboard;
