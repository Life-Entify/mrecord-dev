export const routeNames: IRouteNames = {
  dashboard: "/",
  patients: "/patients",
  families: "/families",
  appointments: "/appointments",
  payments: "/accounts/payments",
  banks: "/accounts/banks",
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
  settings: string;
  users: string;
  logout: string;
}
