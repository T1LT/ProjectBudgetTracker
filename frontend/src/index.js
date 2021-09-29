import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import Dashboard from "./Components/Dashboard";
import Reports from "./Components/Reports";
import Settings from "./Components/Settings";
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
      // case "Transactions": return <Transactions />;
      case "Reports":
        return <Reports />;
      // case "Projects": return <Projects />;
      case "Settings":
        return <Settings />;
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
              <ListItemButton
                onClick={() => settab(text)}
                selected={tab === text}
              >
                <ListItemText>{text}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box id="content">
        <Toolbar />
        {renderdiv()}
      </Box>
    </>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
