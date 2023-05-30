import { Table, TableProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IPayment } from "../../types";
import { getPaymentTableColumns } from "../../Tables";

const Root = styled.div``;

export interface DepositHistoryProps {
  tableProps?: TableProps<IPayment>;
}
export const DepositHistory: React.FC<DepositHistoryProps> = ({
  tableProps,
}) => {
  return (
    <Root>
      <Table {...tableProps} columns={getPaymentTableColumns()} size="small" />
    </Root>
  );
};
