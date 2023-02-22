import { Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { IIncomeCategoryProps, IncomeCategory } from "./Income";

const Root = styled.div``;

export interface IPaymentCategoryProps {
  incomeProps?: IIncomeCategoryProps;
}
export function PaymentCategories({ incomeProps }: IPaymentCategoryProps) {
  return (
    <Root>
      <Tabs>
        <Tabs.TabPane tab="Income" tabKey="1" key={1}>
          <IncomeCategory {...incomeProps} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Expenditure" tabKey="2" key={2}>
          Expenditure component
        </Tabs.TabPane>
      </Tabs>
    </Root>
  );
}
