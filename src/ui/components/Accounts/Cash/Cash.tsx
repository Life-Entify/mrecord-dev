import { Drawer, DrawerProps, Space, Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { BundledCash, IBundledCashProps } from "./BundledCash";

const TableContainer = styled.div`
  margin-top: 50px;
`;

export enum CASH_DIALOG_TYPE {
  CATEGORIES = 1,
  NEW_PAYMENT = 2,
}
export interface ICashProps {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & { drawerType?: CASH_DIALOG_TYPE };
  bundledCashProps?: IBundledCashProps;
}

export function Cash({
  drawerProps,
  toolbarProps,
  bundledCashProps,
}: ICashProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { extra, ...deepToolbarProps } = toolbarProps || {};
  return (
    <div>
      {toolbarProps && <Toolbar {...deepToolbarProps} />}

      <Tabs style={{ marginTop: 50 }}>
        <Tabs.TabPane tab="Bundled Cash" tabKey="3" key={3}>
          <BundledCash {...bundledCashProps} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Unbundled Cash" tabKey="2" key={2}>
          This cash is unbundled
        </Tabs.TabPane>
        <Tabs.TabPane tab="All Cash Payments" tabKey="1" key={1}>
          This cash is unbundled
        </Tabs.TabPane>
      </Tabs>

      <TableContainer>
        {/* <Table<IPatient> {...tableProps} /> */}
      </TableContainer>
      <Drawer {...deepDrawerProps}></Drawer>
    </div>
  );
}
