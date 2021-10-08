import React, { useContext, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import "./Dashboard.css";
import { tabContext } from "../index";

const Dashboard = () => {
  const settab = useContext(tabContext);
  useEffect(() => {
    settab("dash");
  }, [settab]);
  return (
    <div id="dash">
      <div id="left">
        <div id="budgettext">
          <h2 id="totaltext">Total Budget</h2>
          <h1 id="totalamt">$10,000.00</h1>
          <h2 id="inctext">Incurred Expenses</h2>
          <h1 id="incamt">$5,000.00</h1>
        </div>
        <div id="percentage">
          <h1 id="percentamt">50%</h1>
          <h2 id="percenttext">spent</h2>
        </div>
      </div>
      <div id="right">
        <Doughnut
          id="donut"
          data={{
            labels: ["Architect", "DBA", "Developers", "Misc"],
            datasets: [
              {
                data: [1000, 1500, 2000, 500],
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
