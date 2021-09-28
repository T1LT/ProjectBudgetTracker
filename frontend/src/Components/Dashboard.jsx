import React from "react";
import Container from "@mui/material/Container";
import { Doughnut } from "react-chartjs-2";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <Container maxwidth="md">
      <div id="dash">
        <div id="left">
          <div maxWidth="md" id="budgettext">
            <h2 style={{ fontSize: "2rem" }}>Total Budget</h2>
            <h1 style={{ color: "green", fontSize: "4rem", padding: "2.5%" }}>
              $10,000.00
            </h1>
            <h2 style={{ fontSize: "2rem" }}>Incurred Expenses</h2>
            <h1 style={{ color: "red", fontSize: "4rem", padding: "2.5%" }}>
              $5,000.00
            </h1>
          </div>
          <div id="percentage">
            <h1 style={{ color: "#00BFFF", fontSize: "4rem", padding: "2.5%" }}>
              50%
            </h1>
            <h2 style={{ fontSize: "2rem" }}>spent</h2>
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
    </Container>
  );
};

export default Dashboard;
