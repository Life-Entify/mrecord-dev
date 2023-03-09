import React from "react";
import { routeNames } from "./route.names";
const Patients = React.lazy(() => import("components/patients/index"));
const Dashboard = React.lazy(() => import("components/dashboard/index"));
const Payments = React.lazy(() => import("components/accounts/payments/index"));
const Cash = React.lazy(() => import("components/accounts/cash/index"));
const Cheques = React.lazy(() => import("components/accounts/cheques/index"));
const Banks = React.lazy(() => import("components/accounts/banks/index"));
const Payrolls = React.lazy(() => import("components/accounts/payrolls/index"));
const Staff = React.lazy(() => import("components/staff/index"));
const Appointments = React.lazy(() => import("components/appointments/index"));
const Departments = React.lazy(() => import("components/departments/index"));
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
  },
  {
    path: routeNames.banks,
    Component: Banks,
  },
  {
    path: routeNames.cash,
    Component: Cash,
  },
  {
    path: routeNames.cheques,
    Component: Cheques,
  },
  {
    path: routeNames.payrolls,
    Component: Payrolls,
  },
  {
    path: routeNames.staff,
    Component: Staff,
  },
  {
    path: routeNames.appointments,
    Component: Appointments,
  },
  {
    path: routeNames.departments,
    Component: Departments,
  },
];
