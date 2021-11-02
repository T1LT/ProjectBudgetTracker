import React, { useState, useContext, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "./Reports.css";
import { tabContext } from "../index";
import axios from "axios";

const Reports = () => {
	const [expenseData, setExpenseData] = useState([]);
	const [plannedData, setPlannedData] = useState([]);
	const { settab, projectId } = useContext(tabContext);
	useEffect(() => {
		settab("repo");
		axios
			.get(`http://localhost:8000/api/project/${projectId}/report/`)
			.then((response) => {
				let data = Object.keys(response.data["expenses"]).map(
					(key) => response.data["expenses"][key]
				);
				setExpenseData(data);
				data = response.data["monthly_budgets"];
				setPlannedData(data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [settab, projectId]);
	var data = {
		labels: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		datasets: [
			{
				label: "Actual Cost",
				backgroundColor: "rgba(255, 99, 132, 0.2)",
				borderColor: "rgb(255, 99, 132)",
				data: expenseData,
				borderWidth: 1,
			},
			{
				label: "Planned Value",
				backgroundColor: "rgba(255, 159, 64, 0.2)",
				borderColor: "rgba(255, 159, 64)",
				data: plannedData,
				borderWidth: 1,
			},
		],
	};
	return (
		<div id="outside">
			<div id="bar">
				<Bar
					data={data}
					options={{
						scales: {
							x: { beginAtZero: true },
							y: { beginAtZero: true },
						},
					}}
				/>
				<h1>Monthly Expenses Summary</h1>
			</div>
		</div>
	);
};

export default Reports;

// data={{
//   labels: [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ],
//   datasets: [
//     {
//       data: reportData,
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.2)",
//         "rgba(255, 159, 64, 0.2)",
//         "rgba(255, 205, 86, 0.2)",
//         "rgba(75, 192, 192, 0.2)",
//         "rgba(54, 162, 235, 0.2)",
//         // "rgba(153, 102, 255, 0.2)",
//         // "rgba(201, 203, 207, 0.2)",
//       ],
//       borderColor: [
//         "rgb(255, 99, 132)",
//         "rgb(255, 159, 64)",
//         "rgb(255, 205, 86)",
//         "rgb(75, 192, 192)",
//         "rgb(54, 162, 235)",
//         // "rgb(153, 102, 255)",
//         // "rgb(201, 203, 207)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// }}
