import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  CollapsePanelProps,
  CollapseProps,
  Empty,
  Space,
  Tag,
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { IPaymentTableProps, PaymentTable } from "../Tables";
import { ICashBundle, IPayment } from "../types";

const Root = styled.div``;
const BtnContainer = styled.div`
  margin-bottom: 10px;
`;

export interface IUnbundledCashProps {
  payments?: IPayment[];
  paymentTableProps?: Omit<IPaymentTableProps, "payments" | "showTx">;
  onShowBundleForm?: (payments?: IPayment[]) => void;
}
interface IUnbundledCashState {
  payments?: IPayment[];
}

function UnbundledCashFn({
  payments,
  paymentTableProps,
  onShowBundleForm,
}: IUnbundledCashProps) {
  const [state, _setState] = useState<IUnbundledCashState>();
  const setState = (state: Partial<IUnbundledCashState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  if (!payments) return <Empty />;
  return (
    <Root>
      <BtnContainer>
        <Button
          type="primary"
          onClick={() => {
            onShowBundleForm && onShowBundleForm(state?.payments);
          }}
          disabled={!state?.payments || state.payments.length === 0}
        >
          Create Bundle
        </Button>
      </BtnContainer>
      <PaymentTable
        {...{
          ...paymentTableProps,
          tableProps: {
            ...paymentTableProps?.tableProps,
            rowSelection: {
              onChange(_, selectedRows) {
                setState({ payments: selectedRows });
              },
            },
          },
        }}
        payments={payments}
        showTx={false}
      />
    </Root>
  );
}
export const UnbundledCash = React.memo(UnbundledCashFn);
