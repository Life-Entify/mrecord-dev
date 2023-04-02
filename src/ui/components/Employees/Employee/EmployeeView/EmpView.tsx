import { Button, Divider, Dropdown, Tabs, TabsProps, Tag } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { IDepartment } from "ui/components/Departments";
import { IPerson, IProfile } from "ui/components/Person";
import { empDataMapping } from "../data";
import { EMPLOYEE_STATUS, IEmployee } from "../../types";
import { IStaffAccountProps, StaffAccount } from "./EmpAccount";
import { IEmpDepartments, EmpDepartments } from "./EmpDepartments";

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
  employee?: IEmployee;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof (IEmployee & IPerson & IProfile)>,
    "data" | "dataMap"
  >;
  tabProps?: TabsProps;
  empAccountProps?: IStaffAccountProps;
  departments?: IDepartment[];
  removeDept?: (dept: IDepartment) => void;
  onStatusChange?: (status: EMPLOYEE_STATUS) => void;
  empDepartmentProps?: Omit<IEmpDepartments, "departments" | "employee">;
}
export function EmpView({
  employee,
  infoBoardProps,
  tabProps,
  empAccountProps,
  departments,
  empDepartmentProps,
  removeDept,
  onStatusChange,
}: IEmpViewProps) {
  const [showDetails, setShowDetail] = useState<boolean>();
  const { last_name, first_name } = employee?.person?.profile || {};
  const title = `${last_name} ${first_name}`.trim();
  let description = "";
  if (title) description = "Profile Details";
  return (
    <Root>
      {title && (
        <Title>
          {title} ({employee?.status?.toUpperCase()})
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
            dataMap={empDataMapping}
            data={
              {
                ...employee?.person?.profile,
                ...employee?.person,
                ...employee,
              } as Record<string, string>
            }
          />
          <Divider style={{ margin: "20px 0px" }} />
        </>
      )}

      <Divider style={{ margin: "20px 0px" }} />
      <DeptContainer>
        <Title>Departments</Title>
        {employee?.department_ids?.map((deptId, index) => {
          const dept = departments?.find((d) => d._id === deptId);
          if (!dept) return null;
          return (
            <Tag
              color="blue"
              key={`emp-dept-${index}`}
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
          <EmpDepartments
            {...empDepartmentProps}
            departments={departments}
            employee={employee}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Account" key={3}>
          <StaffAccount {...empAccountProps} employee={employee} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Loans" key={4}></Tabs.TabPane>
      </StyledTabs>
    </Root>
  );
}
