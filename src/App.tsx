import React, { Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Layout, Header, Breadcrumb } from "ui";
import { AppSidebar } from "components/base/sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "app/utils/routes";
import { AppLayout } from "components/base/layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {
          return (
            <Route
              key={route.path + "---" + index}
              element={
                <AppLayout>
                  <Suspense>
                    <route.Component />
                  </Suspense>
                </AppLayout>
              }
              path={route.path}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
