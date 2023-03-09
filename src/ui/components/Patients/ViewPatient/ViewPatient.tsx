import { Button, Space, Tabs, TabsProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { IPerson, IProfile } from "ui/components/Person";
import { spreadPatientData } from "../common";
import { patientDataMapping } from "../data";
import { IPatient } from "../types";
import { IPatientFamilyProps, PatientFamily } from "./PatientFamily";

const Root = styled.div``;
const Title = styled.h2``;
const Description = styled.div``;
const StyledTabs = styled(Tabs)`
  margin-top: 50px;
`;

export interface IViewPatientProps {
  description?: React.ReactNode;
  patient?: IPatient;
  infoBoardProps?: Omit<IInfoBoardProps<keyof IPatient>, "data" | "dataMap">;
  tabProps?: TabsProps;
  familyProps?: IPatientFamilyProps;
  onShowEditPage?: (patient?: IPatient) => void;
}
export function ViewPatient({
  description,
  patient,
  infoBoardProps,
  tabProps,
  familyProps,
  onShowEditPage,
}: IViewPatientProps) {
  const { last_name, first_name } = patient?.person?.profile || {};
  return (
    <Root>
      <Title>{last_name + " " + first_name}</Title>
      <Description>{description}</Description>
      <InfoBoard
        {...{
          ...infoBoardProps,
          descriptionProps: {
            extra: (
              <Space>
                <Button onClick={() => onShowEditPage?.(patient)}>Edit</Button>
              </Space>
            ),
          },
        }}
        data={
          spreadPatientData(patient) as Record<
            keyof (IPatient & IPerson & IProfile),
            React.ReactNode
          >
        }
        dataMap={patientDataMapping}
      />
      <StyledTabs type="card" {...tabProps}>
        <Tabs.TabPane tab="Family" key={1}>
          <PatientFamily {...familyProps} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Appointments" key={2}></Tabs.TabPane>
        <Tabs.TabPane tab="Payments" key={3}></Tabs.TabPane>
        <Tabs.TabPane tab="Deposits" key={4}></Tabs.TabPane>
      </StyledTabs>
    </Root>
  );
}
