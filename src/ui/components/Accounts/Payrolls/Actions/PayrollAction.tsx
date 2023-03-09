import { Button, List, Tag } from "antd";
import React from "react";
import styled from "styled-components";
import { IStaff } from "ui/components/Staff";
import { IPayrollAction } from "../../types";

const Root = styled.div``;

export interface IPayrollDeductionProps {
  staffs?: IStaff[]; // I want to use this to display the names of staff involved if it is not for all
  actions?: IPayrollAction[];
}

function PayrollActionFunc({ staffs, actions }: IPayrollDeductionProps) {
  return (
    <Root>
      <List<IPayrollAction>
        dataSource={actions}
        renderItem={(item) => {
          const { is_constant, is_general } = item;

          return (
            <List.Item
              extra={
                <div>
                  {is_constant && <Tag>Constant</Tag>}
                  <Tag>
                    {is_general
                      ? "General"
                      : (item.staff_ids?.length || 0) + " staff"}
                  </Tag>
                  <Tag>{Number(item.amount || 0).toLocaleString()}</Tag>
                </div>
              }
            >
              <List.Item.Meta
                title={item.name}
                description={
                  <>
                    <div>{item.description}</div>
                    <div>
                      {!is_general && <Button size="small">Show staff</Button>}
                      <Button size="small" type="link">
                        View
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
