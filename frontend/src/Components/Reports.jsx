import React, { useState, useContext, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "./Reports.css";
import { tabContext } from "../index";
import axios from "axios";

const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const { settab, projectId } = useContext(tabContext);
  useEffect(() => {
    settab("repo");
    axios
      .get(`http://localhost:8000/api/project/${projectId}/report/`)
      .then((response) => {
        let data = Object.keys(response.data).map((key) => response.data[key]);
        setReportData(data);
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
        label: "Param 1",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        data: reportData,
        borderWidth: 1,
      },
      {
        label: "Param 2",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64)",
        data: reportData,
        borderWidth: 1,
      },
    ],
  };
  return (
    <div id="outside">
      <div id="bar">
        <Bar
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
          data={data}
          options={{
            scales: {
              x: { beginAtZero: true },
              y: { beginAtZero: true },
            },
            plugins: { legend: { display: false } },
          }}
        />
        <h1>Monthly Expenses Summary</h1>
      </div>
    </div>
  );
};

export default Reports;
