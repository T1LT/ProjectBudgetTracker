import React from "react";
import ReactDOM from "react-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DashBoard from "./Dashboard";
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
      <DashBoard/>
    </>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
