import React, { useState } from "react";
import ReactDOM from "react-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Dashboard from "./Dashboard";
import "./index.css";
import "./reset.css";

const Main = () => {
  const states = [
    "Dashboard",
    "Transactions",
    "Reports",
    "Projects",
    "Settings",
  ];
  const [tab, settab] = useState(states[0]);
  const renderdiv = () => {
    switch (tab) {
      case "Dashboard":
        return <Dashboard />;
      // case "transactions": return <Transactions />;
      // case "reports": return <Reports />;
      // case "projects": return <Projects />;
      // case "settings": return <Settings />;
      default:
        return null;
    }
  };
  return (
    <>
      <AppBar
        position="fixed"
        id="appbar"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Budget Tracker
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {states.map((text) => (
            <ListItem disablePadding>
              <ListItemButton onClick={() => settab(text)}>
                <ListItemText>{text}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box id="content" sx={{ position: "relative" }}>
        <Toolbar />
        {renderdiv()}
      </Box>
    </>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
