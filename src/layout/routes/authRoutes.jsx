import { Outlet } from "react-router-dom";
import Login from "../../Pages/Auth/Login";

const AuthRoutes = [
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "/", // Corrected path
        element: <Login />,
      },
     
    ],
  },
];

export default AuthRoutes;
