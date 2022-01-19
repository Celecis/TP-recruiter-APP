/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import { Link } from "@mui/material";
import { Store } from "../utils/store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function NavBar() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();

  const handleLogoutClick = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    router.push("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar color="secondary">
          <Link href="/">
            <IconButton
              size="large"
              edge="start"
              color="primary"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recruiter-app
          </Typography>
          <Button color="inherit">{<Brightness6Icon />}</Button>
          {!userInfo ? (
            <Link href="/login">
              <Button color="secondary">Login</Button>
            </Link>
          ) : (
            <Button color="inherit" onClick={handleLogoutClick}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
