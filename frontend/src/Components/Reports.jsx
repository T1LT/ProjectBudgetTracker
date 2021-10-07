import React from "react";
import { Bar } from "react-chartjs-2";
import "./Reports.css";

const Reports = () => {
  return (
    <div id="bar">
      <Bar
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            {
              data: [1000, 500, 1500, 700, 1300],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                // "rgba(153, 102, 255, 0.2)",
                // "rgba(201, 203, 207, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                // "rgb(153, 102, 255)",
                // "rgb(201, 203, 207)",
              ],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
          },
          plugins: { legend: { display: false } },
        }}
      />
    </div>
  );
};

export default Reports;
