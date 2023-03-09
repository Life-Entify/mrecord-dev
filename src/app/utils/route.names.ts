export const routeNames: IRouteNames = {
  dashboard: "/",
  patients: "/patients",
  families: "/families",
  appointments: "/appointments",
  payments: "/accounts/payments",
  banks: "/accounts/banks",
  cash: "/accounts/cash",
  users: "/users",
  settings: "/settings",
  logout: "/logout",
};

interface IRouteNames {
  dashboard: string;
  patients: string;
  families: string;
  appointments: string;
  payments: string;
  banks: string;
  cash: string;
  settings: string;
  users: string;
  logout: string;
}
