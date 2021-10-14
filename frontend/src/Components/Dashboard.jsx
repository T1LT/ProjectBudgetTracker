import React, { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "./Dashboard.css";
import { tabContext } from "../index";
import axios from "axios";
import { usePreviousProps } from "@mui/utils";

const Dashboard = () => {
	const { settab, projectId } = useContext(tabContext);

	const [data, setData] = useState({});
	const [labels, setLabels] = useState([]);
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		settab("dash");
		(async () => {
			const url = `http://localhost:8000/api/project/${projectId}/`;
			const response = await axios.get(url);
			const apiData = response.data;
			console.log(apiData);
			setData(apiData);

			Object.keys(apiData["expenses"]).map((expense) => {
				setLabels((prevState) => {
					if (apiData["expenses"][expense] !== 0) {
						prevState.push(expense);
					}
					return prevState;
				});
				setChartData((prevState) => {
					if (apiData["expenses"][expense] !== 0) {
						prevState.push(apiData["expenses"][expense]);
					}
					return prevState;
				});
			});
			console.log(labels);
			console.log(chartData);
		})();
	}, [settab, projectId]);
	return (
		<div id="dash">
			<div id="left">
				<div id="budgettext">
					<h2 id="totaltext">Total Budget</h2>
					<h1 id="totalamt">
						${new Intl.NumberFormat().format(data.budget)}
					</h1>
					<h2 id="inctext">Incurred Expenses</h2>
					<h1 id="incamt">
						$
						{new Intl.NumberFormat().format(data.incurred_expenses)}
					</h1>
				</div>
				<div id="percentage">
					<h1 id="percentamt">
						{(data.incurred_expenses / data.budget) * 100}%
					</h1>
					<h2 id="percenttext">spent</h2>
				</div>
			</div>
			<div id="right">
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
									"rgb(0, 205, 100)",
								],
							},
						],
					}}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
