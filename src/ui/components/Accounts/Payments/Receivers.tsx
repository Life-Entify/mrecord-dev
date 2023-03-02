import { Card, List, Space, Tag } from "antd";
import React from "react";
import styled from "styled-components";
import { IIncomeActions, IPaymentReceiver } from "../types";

const Root = styled.div`
  margin-top: 20px;
`;
const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export interface IReceiverProps {
  receivers?: IPaymentReceiver[];
}
function ReceiverFn({ receivers }: IReceiverProps) {
  let income = 0,
    expenditure = 0;
  if (receivers) {
    for (let i = 0; i < receivers.length; i++) {
      const { type_count } = receivers[i];
      const { cash, cheque, transfer } = type_count || {};
      income +=
        (cash?.income || 0) + (transfer?.income || 0) + (cheque?.income || 0);
      expenditure +=
        (cash?.expenditure || 0) +
        (transfer?.expenditure || 0) +
        (cheque?.expenditure || 0);
    }
  }
  return (
    <Root>
      <List
        grid={{
          gutter: 6,
        }}
        header={
          <List.Item>
            <div>
              <strong>Income:</strong> {Number(income).toLocaleString()}
            </div>
            <div>
              <strong>Expenditure:</strong>{" "}
              {Number(expenditure).toLocaleString()}
            </div>
          </List.Item>
        }
        dataSource={receivers}
        renderItem={(staff) => {
          const { person, type_count } = staff || {};
          const { last_name, first_name } = person?.profile || {};
          type incomeAction = keyof typeof IIncomeActions;
          type countType = { name: string; value: number };
          const incomeList: incomeAction[] = [
            "receive_deposit",
            "receive_pay",
            "redeem_credit",
          ];
          const expenditures: countType[] = [];
          const incomes: countType[] = [];
          if (staff?.action_count)
            Object.entries(staff.action_count).map(([name, value], key) => {
              if (incomeList.includes(name as incomeAction)) {
                incomes.push({ name, value });
              } else {
                expenditures.push({ name, value });
              }
            });
          const { cash, transfer, cheque } = type_count || {};
          const totalIncome =
            (cash?.income || 0) +
            (transfer?.income || 0) +
            (cheque?.income || 0);
          const totalExpenditure =
            (cash?.expenditure || 0) +
            (transfer?.expenditure || 0) +
            (cheque?.expenditure || 0);
          return (
            <List.Item>
              <Card
                style={{ background: "#e4e4e4" }}
                title={(last_name || "") + " " + (first_name || "")}
                extra={
                  <Space>
                    <Tag color="green">
                      {Number(totalIncome).toLocaleString()}
                    </Tag>
                    <Tag color="red">
                      {Number(totalExpenditure).toLocaleString()}
                    </Tag>
                  </Space>
                }
              >
                <div>
                  {staff.type_count &&
                    Object.entries(staff.type_count).map(
                      ([name, value], key) => {
                        return (
                          <Tag key={key} color="blue">
                            {name}:
                            <span style={{ color: "green" }}>
                              {Number(value.income || 0).toLocaleString()}{" "}
                            </span>
                            |{" "}
                            <span style={{ color: "red" }}>
                              {Number(value.expenditure || 0).toLocaleString()}
                            </span>
                          </Tag>
                        );
                      }
                    )}
                </div>
                {/* <ActionContainer>
                  <span>
                    {incomes.map(({ name, value }, key) => {
                      return (
                        <Tag key={"income-" + key} color="green">
                          {name}: {Number(value || 0).toLocaleString()}
                        </Tag>
                      );
                    })}
                  </span>
                  <span>
                    {expenditures.map(({ name, value }, key) => {
                      return (
                        <Tag key={"expenditure-" + key} color="error">
                          {name}: {Number(value || 0).toLocaleString()}
                        </Tag>
                      );
                    })}
                  </span>
                </ActionContainer> */}
              </Card>
            </List.Item>
          );
        }}
      />
    </Root>
  );
}

export const Receivers = React.memo(ReceiverFn);
