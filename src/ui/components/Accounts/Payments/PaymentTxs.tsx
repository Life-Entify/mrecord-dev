import { Button, Divider, Space } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { InfoBoard } from "ui/common";
import { ITxTableProps, TxTable } from "../Tables";
import { IPayment } from "../types";
import { paymentLabelMap } from "./data";

const Root = styled.div``;
const TopBtnBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
export interface IPaymentTxProps {
  payment?: IPayment;
  txTableProps?: Omit<ITxTableProps, "txs">;
  resolvePayment?: (paymentId: string) => void;
  markAsUnresolved?: (paymentId: string) => void;
}

export function PaymentTxs({
  txTableProps,
  payment,
  resolvePayment,
  markAsUnresolved,
}: IPaymentTxProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { unresolved } = payment || {};
  return (
    <Root>
      <TopBtnBox>
        <Button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide " : "Show "} Details
        </Button>
        <Button
          onClick={() => {
            if (payment) {
              if (unresolved) {
                resolvePayment?.(payment._id);
              } else {
                markAsUnresolved?.(payment._id);
              }
            }
          }}
        >
          {unresolved ? "Resolve Payment" : "Mark as unresolved"}
        </Button>
      </TopBtnBox>
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
