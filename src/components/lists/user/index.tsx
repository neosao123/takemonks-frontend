import React from "react";
import { useRouter } from "next/router";

// reduxt
import { useDispatch } from "react-redux";
import { setLogout } from "src/redux/slices/user";
import { createBilling } from "src/redux/slices/product";

// material
import {
  Typography,
  Divider,
  ListItemIcon,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Person4RoundedIcon from "@mui/icons-material/Person4Rounded";

// styles
import RootStyled from "./styled";

export default function UserList({ ...props }) {
  const { openUser, user, setOpen, t } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <RootStyled autoFocusItem={openUser} id="composition-menu">
      <Box px={2}>
        <Typography
          variant="body1"
          color="text.primary"
          fontWeight={600}
          noWrap
        >
          {user?.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" pb={1} noWrap>
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuItem
        className="menu-item"
        onClick={() => {
          router.push("/");
          setOpen(false);
        }}
      >
        <ListItemIcon className="menu-icon">
          <HomeRoundedIcon />
        </ListItemIcon>
        {t("header.home")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpen(false);
          router.push("/profile");
        }}
      >
        <ListItemIcon className="menu-icon">
          <Person4RoundedIcon />
        </ListItemIcon>
        {t("header.profile")}
      </MenuItem>
      <Box px={2} mt={1}>
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            dispatch(setLogout());
            setOpen(false);
            dispatch(createBilling(null));
          }}
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          fullWidth
        >
          {t("header.logout")}
        </Button>
      </Box>
    </RootStyled>
  );
}
