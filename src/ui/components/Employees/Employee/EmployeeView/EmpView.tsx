import { Button, Divider, Dropdown, Tabs, TabsProps, Tag } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { IDepartment } from "ui/components/Departments";
import { IPerson, IProfile } from "ui/components/Person";
import { staffDataMapping } from "../data";
import { EMPLOYEE_STATUS, IEmployee } from "../../types";
import { IStaffAccountProps, StaffAccount } from "./EmpAccount";
import { IEmpDepartments, StaffDepartments } from "./EmpDepartments";

const Root = styled.div``;
const Title = styled.h3``;
const Description = styled.div`
  margin-bottom: 20px;
`;
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
const DeptContainer = styled.div`
  margin-bottom: 50px;
`;

export interface IEmpViewProps {
  staff?: IEmployee;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof (IEmployee & IPerson & IProfile)>,
    "data" | "dataMap"
  >;
  tabProps?: TabsProps;
  staffAccountProps?: IStaffAccountProps;
  departments?: IDepartment[];
  removeDept?: (dept: IDepartment) => void;
  onStatusChange?: (status: EMPLOYEE_STATUS) => void;
  staffDepartmentProps?: Omit<IEmpDepartments, "departments" | "staff">;
}
export function EmpView({
  staff,
  infoBoardProps,
  tabProps,
  staffAccountProps,
  departments,
  staffDepartmentProps,
  removeDept,
  onStatusChange,
}: IEmpViewProps) {
  const [showDetails, setShowDetail] = useState<boolean>();
  const { last_name, first_name } = staff?.person?.profile || {};
  const title = `${last_name} ${first_name}`.trim();
  let description = "";
  if (title) description = "Profile Details";
  return (
    <Root>
      {title && (
        <Title>
          {title} ({staff?.status?.toUpperCase()})
        </Title>
      )}
      {description && <Description>{description}</Description>}
      <ButtonContainer>
        <Button onClick={() => setShowDetail(!showDetails)}>
          {showDetails ? "Hide " : "Show "} Details
        </Button>
        <Dropdown
          menu={{
            onClick: ({ key }) => {
              onStatusChange?.(key as EMPLOYEE_STATUS);
            },
            items: [
              { label: "Suspend", key: EMPLOYEE_STATUS.suspended },
              { label: "Active", key: EMPLOYEE_STATUS.active },
              { label: "Deactivate", key: EMPLOYEE_STATUS.deactivated },
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

      <Divider style={{ margin: "20px 0px" }} />
      <DeptContainer>
        <Title>Departments</Title>
        {staff?.department_ids?.map((deptId, index) => {
          const dept = departments?.find((d) => d._id === deptId);
          if (!dept) return null;
          return (
            <Tag
              color="blue"
              key={`staff-dept-${index}`}
              closable
              onClose={(e) => {
                e.preventDefault();
                removeDept?.(dept);
              }}
            >
              {dept.name}
            </Tag>
          );
        })}
      </DeptContainer>
      <StyledTabs tabIndex={2} type="card" {...tabProps}>
        <Tabs.TabPane tab="Family" key={1}></Tabs.TabPane>
        <Tabs.TabPane tab="Departments" key={2}>
          <StaffDepartments
            {...staffDepartmentProps}
            departments={departments}
            staff={staff}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Account" key={3}>
          <StaffAccount {...staffAccountProps} staff={staff} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Loans" key={4}></Tabs.TabPane>
      </StyledTabs>
    </Root>
  );
}
