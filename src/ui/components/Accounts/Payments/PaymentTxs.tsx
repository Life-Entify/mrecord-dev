import { Button, Divider } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { InfoBoard } from "ui/common";
import { ITxTableProps, TxTable } from "../Tables";
import { IPayment } from "../types";
import { paymentLabelMap } from "./data";

const Root = styled.div``;

export interface IPaymentTxProps {
  payment?: IPayment;
  txTableProps?: Omit<ITxTableProps, "txs">;
}

export function PaymentTxs({ txTableProps, payment }: IPaymentTxProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  return (
    <Root>
      <Button
        style={{ marginBottom: 20 }}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide " : "Show "} Details
      </Button>

      {showDetails && (
        <>
          <InfoBoard<keyof IPayment>
            data={structuredClone(payment)}
            skipMap={["_id", "txs", "person"]}
            dataMap={paymentLabelMap}
          />
          <Divider style={{ margin: "20px 0px" }} />
        </>
      )}

      <TxTable
        {...{
          ...txTableProps,
          tableProps: {
            ...txTableProps?.tableProps,
            dataSource: payment?.txs,
          },
        }}
      />
    </Root>
  );
}
