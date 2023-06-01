import { Table, TableProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IDepositorSummary } from "../../types";

const Root = styled.div``;

export interface DepositorProps {
  tableProps?: TableProps<IDepositorSummary>;
}
export const Depositors: React.FC<DepositorProps> = ({ tableProps }) => {
  return (
    <Root>
      <Table
        {...tableProps}
        columns={[
          {
            title: "Client",
            key: "name",
            dataIndex: "name",
          },
          {
            title: "Deposits",
            key: "receive_deposit",
            dataIndex: "receive_deposit",
          },
          {
            title: "Used",
            key: "use_deposit",
            dataIndex: "use_deposit",
          },
          {
            title: "Withdrawn",
            key: "deposit_withdrawal",
            dataIndex: "deposit_withdrawal",
          },
          {
            title: "Balance",
            key: "balance",
            dataIndex: "balance",
          },
        ]}
        size="small"
      />
    </Root>
  );
};
