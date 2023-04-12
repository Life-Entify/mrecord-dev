import { Button, Divider, Space } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { InfoBoard } from "ui/common";
import { BOOLEAN_STRING } from "ui/components/types";
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
  onResolvePayment?: (resolve: BOOLEAN_STRING, paymentId: string) => void;
  onDeletePayment?: (payment: IPayment) => void;
  onOpenUpdatePage?: (payment: IPayment) => void;
}

export function PaymentTxs({
  txTableProps,
  payment,
  categories,
  onResolvePayment,
  onDeletePayment,
  onOpenUpdatePage,
}: IPaymentTxProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { unresolved } = payment || {};
  return (
    <Root>
      <TopBtnBox>
        <Space>
          <Button type="primary" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide " : "Show "} Details
          </Button>
          <Button onClick={() => onOpenUpdatePage?.(payment as IPayment)}>
            Update Payment
          </Button>
        </Space>
        <Space>
          <Button
            onClick={() => {
              if (payment) {
                if (unresolved === BOOLEAN_STRING.yes) {
                  onResolvePayment?.(BOOLEAN_STRING.no, payment._id);
                } else {
                  onResolvePayment?.(BOOLEAN_STRING.yes, payment._id);
                }
              }
            }}
          >
            {unresolved === BOOLEAN_STRING.yes
              ? "Resolve Payment"
              : "Mark as unresolved"}
          </Button>
          <Button onClick={() => onDeletePayment?.(payment as IPayment)}>
            Delete Payment
          </Button>
        </Space>
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
        removeColumns={["tx_type"]}
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
