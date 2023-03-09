import { Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { ExpenditureCategory, IExpenditureCategoryProps } from "./Expenditure";
import { IIncomeCategoryProps, IncomeCategory } from "./Income";

const Root = styled.div``;

export interface IPaymentCategoryProps {
  incomeProps?: IIncomeCategoryProps;
  expenditureProps?: IExpenditureCategoryProps;
}
export function PaymentCategories({
  incomeProps,
  expenditureProps,
}: IPaymentCategoryProps) {
  return (
    <Root>
      <Tabs>
        <Tabs.TabPane tab="Income" tabKey="1" key={1}>
          <IncomeCategory {...incomeProps} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Expenditure" tabKey="2" key={2}>
          <ExpenditureCategory {...expenditureProps} />
        </Tabs.TabPane>
      </Tabs>
    </Root>
  );
}
