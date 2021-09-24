import React from "react";
import ReactDOM from "react-dom";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Doughnut } from "react-chartjs-2";
import "./index.css";
import "./reset.css";

const Main = () => {
  return (
    <>
      <AppBar position="static" id="appbar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Budget Tracker
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container maxwidth="md">
        <div id="dash">
          <div id="left">
            <div maxWidth="md" id="budgettext">
              <h2 style={{ fontSize: "1.25rem" }}>Total Budget</h2>
              <h1 style={{ color: "green", fontSize: "2.5rem" }}>$10,000.00</h1>
              <h2 style={{ fontSize: "1.25rem" }}>Incurred Expenses</h2>
              <h1 style={{ color: "red", fontSize: "2.5rem" }}>$5,000.00</h1>
            </div>
            <div id="percentage">
              <h1 style={{ color: "#00BFFF", fontSize: "2.5rem" }}>50%</h1>
              <h2 style={{ fontSize: "1.25rem" }}>spent</h2>
            </div>
          </div>
          <div id="right">
            <Doughnut
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
    </>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
