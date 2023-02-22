import { Tabs, TabsProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { INatives } from "ui/components/types";
import { IPatientFamilyProps, PatientFamily } from "./PatientFamily";

const Root = styled.div``;
const Title = styled.h2``;
const Description = styled.div``;
const StyledTabs = styled(Tabs)`
  margin-top: 50px;
`;

export interface IViewPatientProps<Patient, NextOfKinData, Person, IInfoBoardMapKeys extends INatives> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  patient?: Patient;
  infoBoardProps?: Omit<IInfoBoardProps<keyof Patient>, "data">;
  tabProps?: TabsProps;
  familyProps?: IPatientFamilyProps<NextOfKinData, Person, IInfoBoardMapKeys>;
}
export function ViewPatient<Patient, NextOfKinData, Person, IInfoBoardMapKeys extends INatives>({
  title,
  description,
  patient,
  infoBoardProps,
  tabProps,
  familyProps,
}: IViewPatientProps<Patient, NextOfKinData, Person, IInfoBoardMapKeys>) {
  return (
    <Root>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <InfoBoard<keyof Patient>
        {...infoBoardProps}
        data={patient as Record<keyof Patient, string>}
      />
      <StyledTabs type="card" {...tabProps}>
        <Tabs.TabPane tab="Family" key={1}>
          <PatientFamily<NextOfKinData, Person, IInfoBoardMapKeys> {...familyProps} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Appointments" key={2}></Tabs.TabPane>
        <Tabs.TabPane tab="Payments" key={3}></Tabs.TabPane>
        <Tabs.TabPane tab="Deposits" key={4}></Tabs.TabPane>
      </StyledTabs>
    </Root>
  );
}
