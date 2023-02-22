import { Layout, Menu, MenuProps } from "antd";
import React from "react";

const { Sider } = Layout;
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
export { getItem as getSidebarItem };
export interface ISiderProps {
  collapsed: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  items: MenuItem[];
  onSelect: (key: string) => void | undefined;
}
export const Sidebar: React.FC<ISiderProps> = function ({
  collapsed,
  setCollapsed,
  items,
  onSelect,
}) {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed?.(value)}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
        }}
      />
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        onSelect={(value) => onSelect && onSelect(value.key)}
      />
    </Sider>
  );
};
