import { MenuProps } from "antd";
import React from "react";
import { ISiderProps, Sidebar } from "ui";
import {
  HomeOutlined,
  UserOutlined,
  UserAddOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { routeNames } from "app/utils";

export type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
export const items = [
  getItem("Dashboard", routeNames.dashboard, <HomeOutlined />),
  getItem("Patients", routeNames.patients, <UserOutlined />),
  getItem("Families", routeNames.families, <UsergroupAddOutlined />),
  getItem("Appointments", routeNames.appointments, <BookOutlined />),
  getItem("Users", routeNames.users, <UserAddOutlined />),
  getItem("Settings", routeNames.settings, <SettingOutlined />),
  getItem("Logout", routeNames.logout, <LogoutOutlined />),
];
export const AppSidebar = (props: Omit<ISiderProps, "items">) => {
  return <Sidebar items={items} {...props} />;
};
