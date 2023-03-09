import { DrawerProps, Table, TableProps, Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { AppDrawer } from "ui/common/views/AppDrawer/AppDrawer";
import { ICheque } from "../types";
import { getChequeTableColumns } from "./data";
import { INewChequeProps, NewCheque } from "./NewCheque";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export enum CHEQUE_DIALOG_TYPE {
  NEW_BOOKLET,
}
export interface IChequesProps {
  toolbarProps?: Omit<IToolbarProps, "extra">;
  drawerProps?: DrawerProps & { drawerType?: CHEQUE_DIALOG_TYPE };
  newChequeProps?: INewChequeProps;
  deepTableProps?: Omit<TableProps<ICheque>, "columns">;
}

export function Cheques({
  drawerProps,
  toolbarProps,
  newChequeProps,
  deepTableProps,
}: IChequesProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { ...deepToolbarProps } = toolbarProps || {};
  return (
    <Root>
      {toolbarProps && <Toolbar {...deepToolbarProps} />}
      <Container>
        <Tabs>
          <Tabs.TabPane key={1} tab="All Booklets">
            <Table {...deepTableProps} columns={getChequeTableColumns()} />
          </Tabs.TabPane>
          <Tabs.TabPane key={2} tab="Used Booklets"></Tabs.TabPane>
        </Tabs>
        {/* <Table<IPatient> {...tableProps} /> */}
        <AppDrawer {...deepDrawerProps}>
          {drawerType === CHEQUE_DIALOG_TYPE.NEW_BOOKLET && (
            <NewCheque {...newChequeProps} />
          )}
        </AppDrawer>
      </Container>
    </Root>
  );
}
