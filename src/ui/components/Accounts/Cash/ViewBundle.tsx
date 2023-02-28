import { Button } from "antd";
import React from "react";
import styled from "styled-components";
import { IPaymentTableProps, PaymentTable } from "../Tables";
import { ICashBundle } from "../types";
const Root = styled.div``;

export interface IViewBundleProps {
  bundle?: ICashBundle;
  paymentTableProps?: Omit<IPaymentTableProps, "payments">;
  onDisplaySpendCash?: React.MouseEventHandler;
}
function ViewBundleFn({
  bundle,
  paymentTableProps,
  onDisplaySpendCash,
}: IViewBundleProps) {
  return (
    <Root>
      {bundle?.cashout_amount !== bundle?.total_amount && (
        <Button style={{ marginBottom: 10 }} onClick={onDisplaySpendCash}>
          {" "}
          Spend Cash
        </Button>
      )}
      <PaymentTable
        {...paymentTableProps}
        payments={bundle?.cashout_payments}
      />
    </Root>
  );
}

export const ViewBundle = React.memo(ViewBundleFn);
