import { Layout, Menu, MenuProps } from 'antd';
import React from 'react';

const { Sider } = Layout;
export type MenuItem = Required<MenuProps>['items'][number];
export interface ISiderProps {
  collapsed: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  items: MenuItem[];
}
export const Sidebar: React.FC<ISiderProps> = function({
  collapsed,
  setCollapsed,
  items
}) {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={value => setCollapsed?.(value)}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      />
      <Menu
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};
