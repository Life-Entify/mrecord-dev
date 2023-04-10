import { Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { TxType } from "../../types";
import { CategoryType, ICategoryTypeProps } from "./CategoryType";

const Root = styled.div``;

export interface IPaymentCategoryProps {
  incomeProps?: Omit<ICategoryTypeProps, "type">;
  expenditureProps?: Omit<ICategoryTypeProps, "type">;
}
export function PaymentCategories({
  incomeProps,
  expenditureProps,
}: IPaymentCategoryProps) {
  return (
    <Root>
      <Tabs>
        <Tabs.TabPane tab="Income" tabKey="1" key={1}>
          <CategoryType {...incomeProps} type={TxType.income} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Expenditure" tabKey="2" key={2}>
          <CategoryType {...expenditureProps} type={TxType.expenditure} />
        </Tabs.TabPane>
      </Tabs>
    </Root>
  );
}
