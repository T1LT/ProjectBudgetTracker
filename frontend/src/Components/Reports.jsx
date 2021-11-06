import React, { useState, useContext, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "./Reports.css";
import { tabContext } from "../index";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const Reports = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [plannedData, setPlannedData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settab, projectId } = useContext(tabContext);
  useEffect(() => {
    settab("repo");
    axios
      .get(`http://localhost:8000/api/project/${projectId}/report/`)
      .then((response) => {
        let data = response.data["expenses"];
        setExpenseData(data);
        data = response.data["monthly_budgets"];
        setPlannedData(data);
        data = response.data["labels"];
        setLabels(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [settab, projectId]);
  var data = {
    labels: labels,
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
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        data: plannedData,
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      {!isLoading ? (
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

export default Reports;
