import React from "react";
import RootLayout from "../nav/rootLayout/index";
import Reporting from "../../Pages/Admin/Reporting";
import Compliance from "../../Pages/Admin/Compliance";
import Home from "../../Pages/Admin/Home";
import AddNewEmployee from "../../Components/AddEmployee";
import ProgessDetails from "../../Pages/Admin/ProgressCard";

const AdminRoutes = [
  {
    path: "/adminDashboard",
    element: <RootLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "safety",
        element: <ProgessDetails />,
      },
      {
        path: "compliance",
        element: <Compliance />,
      },
      {
        path: "reporting",
        element: <Reporting />,
      },
      {
        path: "addNewEmployee",
        element: <AddNewEmployee />,
      },
    ],
  },
];

export default AdminRoutes;
