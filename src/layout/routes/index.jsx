import AuthRoutes from "./authRoutes";
import AdminRoutes from "./adminRoutes";

const ROLES_ROUTES = {
  0: AuthRoutes,
  1: AdminRoutes,
  // 2: UserRoutes,
  // 3: AdminRoutes,
};

export const getRoutes = (role) => {
  return ROLES_ROUTES[role];
};
