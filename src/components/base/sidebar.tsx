import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, getSidebarItem as getItem, MoneyCollectOutlined } from "ui";
import {
  HomeOutlined,
  UserOutlined,
  UserAddOutlined,
  BookOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  ILayoutSidebarProps,
} from "ui";
import { routeNames } from "app/utils";

export const items = [
  getItem("Dashboard", routeNames.dashboard, <HomeOutlined />),
  getItem("Patients", routeNames.patients, <UserOutlined />),
  getItem("Families", routeNames.families, <UsergroupAddOutlined />),
  getItem("Accounts", "", <MoneyCollectOutlined />, [
    getItem("Banks", routeNames.banks),
    getItem("Cash", routeNames.cash),
    getItem("Cheques", routeNames.cheques),
    getItem("Debts", routeNames.debts),
    getItem("Deposits", routeNames.deposits),
    getItem("Payments", routeNames.payments),
    getItem("Payrolls", routeNames.payrolls),
  ]),
  getItem("Human Resource", routeNames.appointments, <UserOutlined />, [
    getItem("Staff", routeNames.staff),
    getItem("Departments", routeNames.departments),
  ]),
  getItem("Appointments", routeNames.appointments, <BookOutlined />),
  getItem("Users", routeNames.users, <UserAddOutlined />),
  getItem("Settings", routeNames.settings, <SettingOutlined />),
];

export const AppSidebar = (props: ILayoutSidebarProps) => {
  const navigate = useNavigate();
  return (
    <Sidebar
      items={items}
      onSelect={(key) => {
        navigate(key);
      }}
      {...props}
    />
  );
};
