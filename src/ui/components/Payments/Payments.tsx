import {
  Button,
  ButtonProps,
  Drawer,
  DrawerProps,
  Space,
} from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { IPaymentCategoryProps, PaymentCategories } from "./Categories/Categories";

const TableContainer = styled.div`
  margin-top: 50px;
`;

export enum PAYMENT_DIALOG_TYPE {
  CATEGORIES = 1,
}
export interface IPaymentsProps {
  toolbarProps?: Omit<IToolbarProps, "extra"> & {
    extra?: {
      categoryBtnProps?: ButtonProps;
    };
  };
  drawerProps?: DrawerProps & { drawerType?: PAYMENT_DIALOG_TYPE };
  paymentCategoryProps?: IPaymentCategoryProps;
}

export function Payments({
  drawerProps,
  toolbarProps,
  paymentCategoryProps,
}: IPaymentsProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { extra, ...deepToolbarProps } = toolbarProps || {};
  return (
    <div>
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
      <TableContainer>
        {/* <Table<IPatient> {...tableProps} /> */}
      </TableContainer>
      <Drawer {...deepDrawerProps}>
        {drawerType === PAYMENT_DIALOG_TYPE.CATEGORIES && (
          <PaymentCategories {...paymentCategoryProps} />
        )}
      </Drawer>
    </div>
  );
}
