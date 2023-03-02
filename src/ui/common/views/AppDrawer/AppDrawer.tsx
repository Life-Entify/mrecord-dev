import { Drawer, DrawerProps } from "antd";
import React from "react";

export function AppDrawer(props: Omit<DrawerProps, "size">) {
  return <Drawer {...props} size="large" />;
}
