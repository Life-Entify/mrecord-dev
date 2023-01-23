import React from "react";
import styled from "styled-components";
export interface IRightComponentProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  onClick?: React.MouseEventHandler;
  // dropdownList: List
}
const Container = styled.div`
  padding: 6px;
  display: flex;
  align-items: center;
`;
const LabelContainer = styled.div``;
const IconContainer = styled.div`
  marg
`;
export const RightComonent: React.FC<IRightComponentProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <Container onClick={onClick}>
      {icon && <IconContainer>{icon}</IconContainer>}
      <LabelContainer>{label}</LabelContainer>
    </Container>
  );
};
