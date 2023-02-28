import { Button, Divider, Dropdown, Tabs, TabsProps } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { IPerson, IProfile } from "ui/components/Person";
import { staffDataMapping } from "../data";
import { IStaff } from "../types";
import { IStaffAccountProps, StaffAccount } from "./StaffAccount";

const Root = styled.div``;
const Title = styled.h2``;
const Description = styled.div``;
const StyledTabs = styled(Tabs)`
  // margin-top: 50px;
  min-height: 200px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export interface IStaffViewProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  staff?: IStaff;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof (IStaff & IPerson & IProfile)>,
    "data" | "dataMap"
  >;
  tabProps?: TabsProps;
  staffAccountProps?: IStaffAccountProps;
}
export function StaffView({
  title,
  description,
  staff,
  infoBoardProps,
  tabProps,
  staffAccountProps,
}: IStaffViewProps) {
  const [showDetails, setShowDetail] = useState<boolean>();
  return (
    <Root>
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      <ButtonContainer>
        <Button onClick={() => setShowDetail(!showDetails)}>
          {showDetails ? "Hide " : "Show "} Details
        </Button>
        <Dropdown
          menu={{
            items: [
              { label: "Suspend", key: "suspended" },
              { label: "Active", key: "active" },
              { label: "Deactivate", key: "deactivated", disabled: true },
            ],
          }}
        >
          <Button type="primary">Change Status</Button>
        </Dropdown>
      </ButtonContainer>
      {showDetails && (
        <>
          <InfoBoard
            {...infoBoardProps}
            dataMap={staffDataMapping}
            data={
              {
                ...staff?.person?.profile,
                ...staff?.person,
                ...staff,
              } as Record<string, string>
            }
          />
          <Divider style={{ margin: "20px 0px" }} />
        </>
      )}
      <StyledTabs type="card" {...tabProps}>
        <Tabs.TabPane tab="Family" key={1}></Tabs.TabPane>
        <Tabs.TabPane tab="Departments" key={2}></Tabs.TabPane>
        <Tabs.TabPane tab="Account" key={3}>
          <StaffAccount {...staffAccountProps} staff={staff} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Loans" key={4}></Tabs.TabPane>
      </StyledTabs>
    </Root>
  );
}
