import { Button, Divider, List } from "antd";
import React, { useMemo } from "react";
import styled from "styled-components";
import { IPayroll, IPayrollAction, IPaySlip } from "../types";

const Root = styled.div``;
const Title = styled.h3``;
const Description = styled.div``;
const Printable = styled.div``;

export interface IPaySlipProps {
  payroll?: Pick<IPayroll, "name" | "description">;
  paySlip?: IPaySlip;
}
function PaySlipFunc({ payroll, paySlip }: IPaySlipProps) {
  const { staff, deductions, bonuses } = paySlip || {};
  const { last_name, first_name } = staff?.person?.profile || {};
  const totalPay = useMemo(() => {
    let amount = 0;
    bonuses?.forEach((item) => {
      amount += item.amount;
    });
    deductions?.forEach((item) => {
      amount -= item.amount;
    });
    return amount;
  }, [JSON.stringify(deductions), JSON.stringify(bonuses)]);
  return (
    <Root>
      <div>
        <Button>Print Slip</Button>
      </div>
      <Printable>
        <Title>{payroll?.name}</Title>
        <Description>{payroll?.description}</Description>
        <Divider style={{ margin: "20px 0px" }} />
        RE: {last_name} {first_name}
        <Divider style={{ margin: "20px 0px" }} />
        <List
          header="Bonuses"
          dataSource={bonuses}
          renderItem={(item, index) => {
            return (
              <List.Item
                key={index}
                extra={Number(item.amount).toLocaleString()}
              >
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />
              </List.Item>
            );
          }}
        />
        <List
          header="Deductions"
          dataSource={deductions}
          renderItem={(item, index) => {
            return (
              <List.Item
                key={index}
                extra={Number(item.amount).toLocaleString()}
              >
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />
              </List.Item>
            );
          }}
          footer={
            <List.Item extra={Number(totalPay).toLocaleString()}>
              <List.Item.Meta title="Net Benefit" />
            </List.Item>
          }
        />
      </Printable>
    </Root>
  );
}

export const PaySlip = React.memo(PaySlipFunc);
