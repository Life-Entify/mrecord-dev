import React from "react";

import { Layout, Header, Breadcrumb } from "ui";
import { AppSidebar } from "components/base/sidebar";

export interface IAppLayout {
  children: React.ReactNode;
}
export const AppLayout: React.FC<IAppLayout> = ({children}) => {
  return (
    <Layout
      Sidebar={AppSidebar}
      Breadcrumb={Breadcrumb}
      Header={() => (
        <Header
          title={<span style={{ color: "white" }}>Medical Records</span>}
        />
      )}
    >
      {children}
    </Layout>
  );
};
