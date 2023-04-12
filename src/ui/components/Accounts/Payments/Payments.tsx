import { Button, ButtonProps, Drawer, DrawerProps, Space, Tabs } from "antd";
import React, { useCallback } from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { IPersonProps, Person } from "ui/components/Person";
import { IPaymentTableProps, PaymentTable } from "../Tables";
import {
  IPaymentCategoryProps,
  PaymentCategories,
} from "./Categories/Categories";
import { INewPaymentProps, NewPayment } from "./NewPayment";
import { INewPaymentCatProps, NewPaymentCat } from "./NewPaymentCat";
import { IPaymentReceiptProps, PaymentReceipt } from "./PaymentReceipt";
import { IPaymentTxProps, PaymentTxs } from "./PaymentTxs";
import { IReceiverProps, Receivers } from "./Receivers";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export enum PAYMENT_DIALOG_TYPE {
  CATEGORIES,
  NEW_PAYMENT,
  NEW_PAYMENT_CAT,
  PAYMENT_TXS,
  SHOW_RECEIPT,
  SHOW_CLIENT,
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
  addPaymentCatProps?: INewPaymentCatProps & {
    onBack?: React.MouseEventHandler;
  };
  paymentTableProps?: IPaymentTableProps;
  paymentTxsProps?: IPaymentTxProps;
  paymentReceiptProps?: IPaymentReceiptProps & {
    onBack?: React.MouseEventHandler;
  };
  receiverProps?: IReceiverProps;
  personProps?: IPersonProps & {
    onBack?: React.MouseEventHandler;
  };
}

export function Payments({
  drawerProps,
  toolbarProps,
  paymentCategoryProps,
  newPaymentProps,
  addPaymentCatProps,
  paymentTableProps,
  paymentTxsProps,
  paymentReceiptProps,
  receiverProps,
  personProps,
}: IPaymentsProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { extra, ...deepToolbarProps } = toolbarProps || {};
  const { onBack: receiptOnBack, ...deepPaymentReceiptProps } =
    paymentReceiptProps || {};
  const { onBack: personOnBack, ...deepPersonProps } = personProps || {};
  const { onBack: addPayCatOnBack, ...deepAddPaymentCatProps } =
    addPaymentCatProps || {};
  const getExtra = useCallback(
    (type: PAYMENT_DIALOG_TYPE) => {
      switch (type) {
        case PAYMENT_DIALOG_TYPE.SHOW_RECEIPT:
          return <Button onClick={receiptOnBack}>Back</Button>;
        case PAYMENT_DIALOG_TYPE.SHOW_CLIENT:
          return <Button onClick={personOnBack}>Back</Button>;
        case PAYMENT_DIALOG_TYPE.NEW_PAYMENT_CAT:
          return <Button onClick={addPayCatOnBack}>Back</Button>;
      }
    },
    [!!receiptOnBack, !!personOnBack, !!addPayCatOnBack]
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
            <Receivers {...receiverProps} />
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
          {drawerType === PAYMENT_DIALOG_TYPE.NEW_PAYMENT_CAT && (
            <NewPaymentCat {...deepAddPaymentCatProps} />
          )}
          {drawerType === PAYMENT_DIALOG_TYPE.PAYMENT_TXS && (
            <PaymentTxs {...paymentTxsProps}/>
          )}
          {drawerType === PAYMENT_DIALOG_TYPE.SHOW_RECEIPT && (
            <PaymentReceipt {...deepPaymentReceiptProps} />
          )}
          {drawerType === PAYMENT_DIALOG_TYPE.SHOW_CLIENT && (
            <Person {...deepPersonProps} />
          )}
        </Drawer>
      </Container>
    </Root>
  );
}
