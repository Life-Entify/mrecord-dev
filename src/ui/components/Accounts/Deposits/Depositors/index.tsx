import { Table, TableProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IDepositorSummary } from "../../types";

const Root = styled.div``;

export interface DepositorProps {
  tableProps?: TableProps<IDepositorSummary>;
}
export const Depositors: React.FC<DepositorProps> = ({ tableProps }) => {
  function render(value: number | undefined) {
    return Number(value || 0).toLocaleString();
  }
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
            render,
          },
          {
            title: "Used",
            key: "use_deposit",
            dataIndex: "use_deposit",
            render,
          },
          {
            title: "Withdrawn",
            key: "deposit_withdrawal",
            dataIndex: "deposit_withdrawal",
            render,
          },
          {
            title: "Balance",
            key: "balance",
            dataIndex: "balance",
            render,
          },
        ]}
        size="small"
      />
    </Root>
  );
};
