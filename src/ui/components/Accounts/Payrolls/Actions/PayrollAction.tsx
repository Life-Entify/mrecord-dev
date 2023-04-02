import { Button, List, Tag } from "antd";
import React from "react";
import styled from "styled-components";
import { IEmployee } from "ui/components/Employees/Employee";
import { IPayrollAction } from "../../types";

const Root = styled.div``;

export interface IPayrollActionProps {
  employees?: IEmployee[]; // I want to use this to display the names of employee involved if it is not for all
  actions?: IPayrollAction[];
  onDelete?: (payrollAction: IPayrollAction) => void;
  onEdit?: (payrollAction: IPayrollAction) => void;
  onView?: (payrollAction: IPayrollAction) => void;
  onActiveChange?: (payrollAction: IPayrollAction, active: boolean) => void;
}

function PayrollActionFunc({
  employees,
  actions,
  onDelete,
  onEdit,
  onView,
  onActiveChange,
}: IPayrollActionProps) {
  return (
    <Root>
      <List<IPayrollAction>
        dataSource={actions}
        renderItem={(item) => {
          const { is_constant, is_general, active } = item;
          return (
            <List.Item
              extra={
                <div>
                  {is_constant && <Tag>Constant</Tag>}
                  <Tag>
                    {is_general
                      ? "General"
                      : (item.employee_ids?.length || 0) + " employee(s)"}
                  </Tag>
                  <Tag>{Number(item.amount || 0).toLocaleString()}</Tag>
                </div>
              }
            >
              <List.Item.Meta
                title={`${item.name} (${active ? "Active" : "Inactive"})`}
                description={
                  <>
                    <div>{item.description}</div>
                    <div>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => onView?.(item)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => onActiveChange?.(item, !active)}
                      >
                        {active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => onEdit?.(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        style={{ color: "#e29898" }}
                        type="link"
                        onClick={() => onDelete?.(item)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
    </Root>
  );
}

export const PayrollAction = React.memo(PayrollActionFunc);
