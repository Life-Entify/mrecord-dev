export const routeNames: IRouteNames = {
  dashboard: "/",
  patients: "/patients",
  families: "/families",
  appointments: "/appointments",
  users: "/users",
  settings: "/settings",
  logout: "/logout",
};

interface IRouteNames {
  dashboard: string;
  patients: string;
  families: string;
  appointments: string;
  settings: string;
  users: string;
  logout: string;
}
