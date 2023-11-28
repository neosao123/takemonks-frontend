import * as React from "react";
import dynamic from "next/dynamic";
// material
import ApplyAmcs from "./applyAmcs";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import ListItemText from "@mui/material/ListItemText";
import { alpha } from "@mui/material/styles";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import MaintenanceIcon from "@mui/icons-material/Settings";
const Wishlist = dynamic(() => import("./wishlist"));
// const InvoiceHistory = dynamic(() => import("./invoiceHistory"));
import InvoiceHistory from "./invoiceHistory";
const AccountGeneral = dynamic(() => import("./edit/accountGeneral"));
const AccountChangePassword = dynamic(
  () => import("./edit/accountChangePassword")
);
const AccountBilling = dynamic(() => import("./edit/accountBilling"));

const drawerWidth = 240;
const sideItems = [
  {
    name: "Wishlist",
    icon: <FavoriteBorderRoundedIcon />,
  },
  {
    name: "Invoice & Orders",
    icon: <ReceiptRoundedIcon />,
  },
  {
    name: "General",
    icon: <Person2RoundedIcon />,
  },
  {
    name: "Billing",
    icon: <ReceiptLongRoundedIcon />,
  },
  {
    name: "Change Password",
    icon: <VpnKeyRoundedIcon />,
  },
  {
    name: "Apply AMCS",
    icon: <MaintenanceIcon />,
  },
];

export default function ProfileTabs() {
  const [index, setIndex] = React.useState(0);

  const handleChange = (event: any, newValue: number) => {
    setIndex(newValue);
  };
  return (
    <Box sx={{ display: { md: "flex", xs: "block" } }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            position: "static",
            width: drawerWidth,
            boxSizing: "border-box",
          },
          display: { md: "block", xs: "none" },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {sideItems.map((item, i) => (
            <ListItem
              key={item.name}
              disablePadding
              sx={{
                mb: 1,
                ...(index === i && {
                  color: (theme) => theme.palette.primary.main,
                  borderRadius: "4px 0 0 4px",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                  },
                  "&:after": {
                    content: "''",
                    width: 2,
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: (theme) => theme.palette.primary.main,
                  },
                }),
              }}
            >
              <ListItemButton onClick={() => setIndex(i)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box
        sx={{
          display: { md: "none", xs: "block" },
          "& .MuiTabs-flexContainer": {
            justifyContent: { sm: "center", xs: "start" },
          },
        }}
      >
        <Tabs
          value={index}
          onChange={handleChange}
          aria-label="disabled tabs example"
          variant="scrollable"
        >
          {sideItems.map((v) => (
            <Tab icon={v.icon} key={v.name} label={v.name} />
          ))}
        </Tabs>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          py: 3,
          px: { md: 3, xs: 0 },
        }}
      >
        {index === 0 ? (
          <Paper
            sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}
          >
            <Wishlist />
          </Paper>
        ) : index === 1 ? (
          <InvoiceHistory />
        ) : index === 2 ? (
          <AccountGeneral />
        ) : index === 3 ? (
          <AccountBilling />
        ) : index == 4 ? (
          <AccountChangePassword />
        ) : (
          <ApplyAmcs />
        )}
      </Box>
    </Box>
  );
}
