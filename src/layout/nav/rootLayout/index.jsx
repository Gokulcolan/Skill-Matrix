import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../../../Assets/Images/tvs-lucas-logo.png";
import { AdminMenuItems } from "../../../utils/constants/menuItems";
import { handleSesssionStorage } from "../../../utils/helperFunctions";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


// const AppBar = styled(MuiAppBar)(({ theme }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
// }));
const settings = ['Logout'];
export default function RootLayout() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [adminMenuData, setAdminMenuData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = parseInt(handleSesssionStorage("get", "ur"), 10);
    if (userRole === 1) {
      const menuData = AdminMenuItems[0]?.isNested || [];
      setAdminMenuData(menuData);
    } else {
      setAdminMenuData([]);
    }
  }, []);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavMenu = (path) => navigate(path);

  const handleLogOut = () => {
    handleSesssionStorage("remove", "ur");
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <AppBar position="static" className="header">
        {/* <Container maxWidth="xl"> */}
        <Toolbar className="headerAlignment">
          {/* Logo */}

          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
            }}
          >
            <img src={logo} alt="Logo" />
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: "blue" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {adminMenuData.map((menu, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleNavMenu(menu.path);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography
                    textAlign="center"
                    sx={{
                      color:
                        location?.pathname === menu.path
                          ? "red !important"
                          : "white !important",
                    }}
                  >
                    {menu.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box className="align" sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, }}>
            {adminMenuData.map((menu, index) => (
              <Button
                key={index}
                onClick={() => handleNavMenu(menu.path)}
                sx={{
                  my: 2,
                  color: location?.pathname === menu.path ? "white" : "#303972", // Active state: white color, Normal state: darker color
                  backgroundColor: location?.pathname === menu.path ? "rgb(0 93 167)" : "transparent", // Active state: blue background, Normal state: transparent
                  borderRadius: "8px", // Rounded corners for a modern look
                  fontWeight: "600",
                  padding: "10px 20px", // Some padding for better spacing
                  display: "block",
                  transition: "all 0.3s ease", // Smooth transition for hover and active state
                  boxShadow: location?.pathname === menu.path ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "", // Subtle shadow for active state
                  ":hover": {
                    backgroundColor: location?.pathname === menu.path ? "rgb(0 93 167)" : "#f0f0f0", // Hover effect with background change
                    color: location?.pathname === menu.path ? "white" : "#303972", // Hover effect: change color for non-active states
                  },
                  ":focus": {
                    outline: "none", // Remove default focus outline
                  },
                }}
              >
                {menu.name}
              </Button>
            ))}

          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                <AccountCircleIcon sx={{ fontSize: "3rem", color: "#1976d2" }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => ( */}
              {/* key={setting} */}
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography sx={{ textAlign: 'center' }} onClick={handleLogOut}>Logout</Typography>
              </MenuItem>
              {/* ))} */}
            </Menu>
          </Box>

        </Toolbar>
        {/* </Container> */}
      </AppBar>

      {/* Outlet for Nested Routes */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
