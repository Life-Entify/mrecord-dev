import React from "react";
import { routeNames } from "./route.names";
const Patients = React.lazy(() => import("../../components/patients/index"));
const Dashboard = React.lazy(() => import("../../components/dashboard/index"));
const Payments = React.lazy(() => import("../../components/payments/index"));
export const routes: {
  path: string;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
}[] = [
  {
    path: routeNames.patients,
    Component: Patients,
  },
  {
    path: routeNames.dashboard,
    Component: Dashboard,
  },
  {
    path: routeNames.payments,
    Component: Payments,
  }
];
