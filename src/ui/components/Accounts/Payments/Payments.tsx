import { Button, ButtonProps, Drawer, DrawerProps, Space, Tabs } from "antd";
import React, { useCallback } from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { IPaymentTableProps, PaymentTable } from "../Tables";
import {
  IPaymentCategoryProps,
  PaymentCategories,
} from "./Categories/Categories";
import { INewPaymentProps, NewPayment } from "./NewPayment";
import { IPaymentReceiptProps, PaymentReceipt } from "./PaymentReceipt";
import { IPaymentTxProps, PaymentTxs } from "./PaymentTxs";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export enum PAYMENT_DIALOG_TYPE {
  CATEGORIES = 1,
  NEW_PAYMENT = 2,
  PAYMENT_TXS = 3,
  SHOW_RECEIPT = 4,
}
export interface IPaymentsProps {
  toolbarProps?: Omit<IToolbarProps, "extra"> & {
    extra?: {
      categoryBtnProps?: ButtonProps;
    };
  };
  drawerProps?: DrawerProps & { drawerType?: PAYMENT_DIALOG_TYPE };
  paymentCategoryProps?: IPaymentCategoryProps;
  newPaymentProps?: INewPaymentProps;
  paymentTableProps?: IPaymentTableProps;
  paymentTxsProps?: IPaymentTxProps;
  paymentReceiptProps?: IPaymentReceiptProps & {
    onBack?: React.MouseEventHandler;
  };
}

export function Payments({
  drawerProps,
  toolbarProps,
  paymentCategoryProps,
  newPaymentProps,
  paymentTableProps,
  paymentTxsProps,
  paymentReceiptProps,
}: IPaymentsProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { extra, ...deepToolbarProps } = toolbarProps || {};
  const { onBack: receiptOnBack, ...deepPaymentReceiptProps } =
    paymentReceiptProps || {};
  const getExtra = useCallback(
    (type: PAYMENT_DIALOG_TYPE) => {
      switch (type) {
        case PAYMENT_DIALOG_TYPE.SHOW_RECEIPT:
          return <Button onClick={receiptOnBack}>Back to Txs</Button>;
      }
    },
    [receiptOnBack]
  );
  return (
    <Root>
      {toolbarProps && (
        <Toolbar
          {...deepToolbarProps}
          extra={
            <Space>
              {extra?.categoryBtnProps && (
                <Button {...extra?.categoryBtnProps}>Categories</Button>
              )}
            </Space>
          }
        />
      )}
      <Container>
        <Tabs>
          <Tabs.TabPane key={1} tab="Payments">
            <PaymentTable {...paymentTableProps} />
          </Tabs.TabPane>
          <Tabs.TabPane key={2} tab="Receivers">
            This is the receivers
          </Tabs.TabPane>
        </Tabs>
        {/* <Table<IPatient> {...tableProps} /> */}
        <Drawer
          {...deepDrawerProps}
          extra={getExtra(drawerType as PAYMENT_DIALOG_TYPE)}
        >
          {drawerType === PAYMENT_DIALOG_TYPE.CATEGORIES && (
            <PaymentCategories {...paymentCategoryProps} />
          )}
          {drawerType === PAYMENT_DIALOG_TYPE.NEW_PAYMENT && (
            <NewPayment {...newPaymentProps} />
          )}
          {drawerType === PAYMENT_DIALOG_TYPE.PAYMENT_TXS && (
            <PaymentTxs {...paymentTxsProps} />
          )}
          {drawerType === PAYMENT_DIALOG_TYPE.SHOW_RECEIPT && (
            <PaymentReceipt {...deepPaymentReceiptProps} />
          )}
        </Drawer>
      </Container>
    </Root>
  );
}
