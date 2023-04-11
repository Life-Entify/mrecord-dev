import { Button, Divider, Space } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { InfoBoard } from "ui/common";
import { ITxTableProps, TxTable } from "../Tables";
import { IPayment, IPaymentCategory } from "../types";
import { paymentLabelMap } from "./data";

const Root = styled.div``;
const TopBtnBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
export interface IPaymentTxProps {
  categories?: IPaymentCategory[];
  payment?: IPayment;
  txTableProps?: Omit<ITxTableProps, "txs">;
  resolvePayment?: (paymentId: string) => void;
  markAsUnresolved?: (paymentId: string) => void;
}

export function PaymentTxs({
  txTableProps,
  payment,
  categories,
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
            dataSource: payment?.txs?.map((i) => {
              const cat = categories?.find((c) => c._id === i.category_id);
              if (cat) i.category = cat;
              return i;
            }),
          },
        }}
      />
    </Root>
  );
}
