import { Button, ButtonProps, Drawer, DrawerProps, Space, Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import {
  IPaymentCategoryProps,
  PaymentCategories,
} from "./Categories/Categories";
import { INewPaymentProps, NewPayment } from "./NewPayment";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export enum PAYMENT_DIALOG_TYPE {
  CATEGORIES = 1,
  NEW_PAYMENT = 2,
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
}

export function Payments({
  drawerProps,
  toolbarProps,
  paymentCategoryProps,
  newPaymentProps,
}: IPaymentsProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { extra, ...deepToolbarProps } = toolbarProps || {};
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
            This is payment
          </Tabs.TabPane>
          <Tabs.TabPane key={2} tab="Receivers">
            This is the receivers
          </Tabs.TabPane>
        </Tabs>
        {/* <Table<IPatient> {...tableProps} /> */}
        <Drawer {...deepDrawerProps}>
          {drawerType === PAYMENT_DIALOG_TYPE.CATEGORIES && (
            <PaymentCategories {...paymentCategoryProps} />
          )}
          {drawerType === PAYMENT_DIALOG_TYPE.NEW_PAYMENT && (
            <NewPayment {...newPaymentProps} />
          )}
        </Drawer>
      </Container>
    </Root>
  );
}
