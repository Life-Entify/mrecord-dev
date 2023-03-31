import { Layout, theme } from "antd";
import React from "react";
import styled from "styled-components";

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)`
  padding-inline: 16px !important;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
`;
export interface IHeaderProps {
  title?: React.ReactNode;
  RightComponent?: React.FC;
}
export const Header: React.FC<IHeaderProps> = function ({
  title,
  RightComponent,
}) {
  const {
    token: { colorBgTextActive },
  } = theme.useToken();
  return (
    <StyledHeader style={{ color: colorBgTextActive }}>
      <div>{title}</div>
      {RightComponent && <RightComponent />}
    </StyledHeader>
  );
};
