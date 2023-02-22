import React from "react";
import styled from "styled-components";

export type TableHeaderPositions = "center" | "left" | "right";
enum TABLE_HEADER_POSITIONS {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}
const Root = styled.div<{ position?: TABLE_HEADER_POSITIONS }>``;
export interface ITableHeaderProps {
  position?: TABLE_HEADER_POSITIONS;
  children: React.ReactNode;
}
export const TableHeader: React.FC<ITableHeaderProps> = ({
  children,
  position,
}) => {
  return <Root position={position}>{children}</Root>;
};
