import { Button, Drawer, DrawerProps, Tabs } from "antd";
import React, { useCallback } from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { AppDrawer } from "ui/components/Common";
import { BundledCash, IBundledCashProps } from "./BundledCash/BundledCash";
import { ISpendCashProps, SpendCash } from "./SpendCash";
import { IToBankProps, ToBank } from "./ToBank";
import { IUnbundledCashProps, UnbundledCash } from "./UnbundledCash";
import { IViewBundleProps, ViewBundle } from "./ViewBundle";

const TableContainer = styled.div`
  margin-top: 50px;
`;
export enum CASH_DIALOG_TYPE {
  CASH_TO_BANK,
  SHOW_BUNDLE,
  SPEND_CASH,
}
export interface ICashProps {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & { drawerType?: CASH_DIALOG_TYPE };
  bundledCashProps?: IBundledCashProps;
  moveToBankProps?: IToBankProps;
  unbundledCashProps?: IUnbundledCashProps;
  viewBundleProps?: IViewBundleProps;
  spendCashProps?: ISpendCashProps & {
    onBack?: React.MouseEventHandler;
  };
}

export function Cash({
  drawerProps,
  toolbarProps,
  bundledCashProps,
  moveToBankProps,
  unbundledCashProps,
  viewBundleProps,
  spendCashProps,
}: ICashProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { extra, ...deepToolbarProps } = toolbarProps || {};
  const { onBack: spendCashBack, ...deepSpendProps } = spendCashProps || {};
  const getExtra = useCallback(
    (type?: CASH_DIALOG_TYPE) => {
      switch (type) {
        case CASH_DIALOG_TYPE.SPEND_CASH:
          return <Button onClick={spendCashBack}>Back</Button>;
      }
      return null;
    },
    [!!spendCashBack]
  );
  return (
    <div>
      {toolbarProps && <Toolbar {...deepToolbarProps} />}

      <Tabs style={{ marginTop: 50 }}>
        <Tabs.TabPane tab="Bundled Cash" tabKey="3" key={3}>
          <BundledCash {...bundledCashProps} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Unbundled Cash" tabKey="2" key={2}>
          <UnbundledCash {...unbundledCashProps} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="All Cash Payments" tabKey="1" key={1}>
          This cash is unbundled
        </Tabs.TabPane>
      </Tabs>

      <AppDrawer {...deepDrawerProps} extra={getExtra(drawerType)}>
        {drawerType === CASH_DIALOG_TYPE.CASH_TO_BANK && (
          <ToBank {...moveToBankProps} />
        )}
        {drawerType === CASH_DIALOG_TYPE.SHOW_BUNDLE && (
          <ViewBundle {...viewBundleProps} />
        )}
        {drawerType === CASH_DIALOG_TYPE.SPEND_CASH && (
          <SpendCash {...deepSpendProps} />
        )}
      </AppDrawer>
    </div>
  );
}
