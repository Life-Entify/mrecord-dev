import React from "react";
import { routeNames } from "./route.names";
const Patients = React.lazy(() => import("../../components/patients/index"));
export const routes: {
  path: string;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
}[] = [
  {
    path: routeNames.patients,
    Component: Patients,
  },
];
