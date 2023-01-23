import { Layout as AntLayout, theme } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ISiderProps } from '../Sidebar';

const ComponentContainer = styled.div`
  padding: 24px;
  minheight: 340px;
  background: ${props => props.theme.colorBgContainer};
`;
const { Content } = AntLayout;
export interface ILayoutProps {
  Sidebar?: React.FC<Omit<ISiderProps, 'items'>>;
  children: React.ReactNode;
  Header?: React.FC;
  Breadcrumb?: React.FC;
}
export const Layout = function({
  children,
  Sidebar,
  Header,
  Breadcrumb,
}: ILayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <AntLayout hasSider>
      {Sidebar && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <AntLayout className="site-layout" style={{ height: '100vh' }}>
        {Header && <Header />}
        <Content style={{ margin: '0 16px' }}>
          {Breadcrumb && <Breadcrumb />}
          <ComponentContainer style={{ background: colorBgContainer }}>
            {children}
          </ComponentContainer>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
