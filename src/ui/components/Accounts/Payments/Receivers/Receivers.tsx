import { Card, Divider, Space, Tag } from "antd";
import React from "react";
import styled from "styled-components";
import {
  AccountAction,
  IPaymentSummaryEmp,
  IncomeFalse,
  PaymentType,
  TxType,
} from "../../types";
import { paymentFalseIncome } from "ui/common/constants";

const Root = styled.div`
  margin-top: 20px;
`;
const Body = styled.div`
  margin-top: 20px;
`;
const Summary = styled.div`
  margin-top: 20px;
`;

export interface IReceiverProps {
  paymentSummary?: IPaymentSummaryEmp[];
}
function ReceiverFn({ paymentSummary }: IReceiverProps) {
  let income = 0,
    expenditure = 0,
    falseIncome = 0;
  const payTypes: Record<PaymentType, Record<TxType, number>> = {
    [PaymentType.cash]: { expenditure: 0, income: 0 },
    [PaymentType.transfer]: { expenditure: 0, income: 0 },
    [PaymentType.cheque]: { expenditure: 0, income: 0 },
  };
  const actionTypes: Partial<Record<AccountAction, number>> = {};
  if (paymentSummary) {
    for (let i = 0; i < paymentSummary.length; i++) {
      const { action_types, pay_types } = paymentSummary[i];
      for (let i = 0; i < pay_types.length; i++) {
        const { pay_type, total_amount, tx_type } = pay_types[i];
        if (tx_type === TxType.income) income += total_amount;
        else expenditure += total_amount;
        payTypes[pay_type][tx_type] += total_amount;
      }
      for (let i = 0; i < action_types.length; i++) {
        const { action_type, total_amount } = action_types[i];
        if (paymentFalseIncome.indexOf(action_type as IncomeFalse) !== -1) {
          falseIncome += total_amount;
        }
        if (actionTypes[action_type]) {
          actionTypes[action_type] =
            (actionTypes[action_type] || 0) + total_amount;
        } else {
          actionTypes[action_type] = total_amount;
        }
      }
    }
  }
  return (
    <Root>
      <Summary>
        <div>
          <strong>Expenditure:</strong> {Number(expenditure).toLocaleString()}
        </div>
        <div>
          <strong>Income:</strong> {Number(income).toLocaleString()}
        </div>
        <div>
          <strong>Realized Amount:</strong>{" "}
          {Number(income - falseIncome).toLocaleString()}
        </div>
      </Summary>
      <Body>
        {paymentSummary?.map((staff, index) => {
          const { employee, action_types, pay_types } = staff || {};
          const { last_name, first_name } = employee?.person?.profile || {};
          let empFalseIncome = 0;
          const totalValues = {
            income: 0,
            expenditure: 0,
            falseIncome: 0,
          };
          action_types.forEach(({ action_type, total_amount }) => {
            if (paymentFalseIncome.indexOf(action_type as IncomeFalse) !== -1) {
              totalValues.falseIncome += total_amount;
            }
          });
          pay_types.forEach(({ tx_type, total_amount }) => {
            if (tx_type === TxType.expenditure)
              totalValues.expenditure += total_amount;
            else if (tx_type === TxType.income)
              totalValues.income += total_amount;
          });
          return (
            <Card
              key={index}
              style={{ boxShadow: "0px 0px 1px" }}
              title={(last_name || "") + " " + (first_name || "")}
              extra={
                <Space>
                  <Tag color="red">
                    Total Out:{" "}
                    {Number(totalValues.expenditure).toLocaleString()}
                  </Tag>
                  <Tag color="green">
                    Total In: {Number(totalValues.income).toLocaleString()}
                  </Tag>
                  <Tag color="green">
                    Realized:{" "}
                    {Number(
                      totalValues.income - totalValues.falseIncome
                    ).toLocaleString()}
                  </Tag>
                </Space>
              }
            >
              <div>
                {Object.entries(payTypes)?.map(([name, value], key) => {
                  return (
                    <Tag key={key} color="blue">
                      {name} :
                      <span style={{ color: "green" }}>
                        {Number(value.income || 0).toLocaleString()}{" "}
                      </span>{" "}
                      |
                      <span style={{ color: "red" }}>
                        {Number(value.expenditure || 0).toLocaleString()}{" "}
                      </span>
                    </Tag>
                  );
                })}
              </div>
              <Divider style={{ margin: "10px 0px" }} />
              <div>
                {action_types?.map(({ action_type, total_amount }, key) => {
                  if (
                    Object.keys(paymentFalseIncome).indexOf(action_type) !== -1
                  ) {
                    empFalseIncome += total_amount;
                  }
                  return (
                    <Tag key={key} color="blue">
                      {action_type}:
                      <span>{Number(total_amount || 0).toLocaleString()} </span>
                    </Tag>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </Body>
    </Root>
  );
}

export const Receivers = React.memo(ReceiverFn);
