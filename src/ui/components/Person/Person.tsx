import { DrawerProps, Table, TableProps } from "antd";
import { RenderedCell } from "rc-table/lib/interface";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common";
import { AppDrawer } from "ui/common/views/AppDrawer/AppDrawer";
import { getPersonTableColumns } from "./data";
import { IPerson } from "./types";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 20px;
`;

export enum PERSON_DRAWER_TYPES {
  NEW_PERSON,
}
export interface IPersonProps {
  toolbarProps?: IToolbarProps;
  persons?: IPerson[];
  tableProps?: Omit<TableProps<IPerson>, "columns" | "dataSource"> & {
    render?: (
      keyIndex: string
    ) => (
      value: any,
      record: IPerson,
      index: number
    ) => React.ReactNode | RenderedCell<IPerson>;
  };
  drawerProps?: Omit<DrawerProps, "size"> & { drawerType: PERSON_DRAWER_TYPES };
}

function PersonFunc({
  toolbarProps,
  tableProps,
  persons,
  drawerProps,
}: IPersonProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  return (
    <Root>
      {toolbarProps && <Toolbar {...toolbarProps} />}

      <Container>
        <Table
          {...tableProps}
          dataSource={persons}
          columns={getPersonTableColumns()}
        />
      </Container>

      {drawerProps && (
        <AppDrawer {...deepDrawerProps}>
          {drawerType === PERSON_DRAWER_TYPES.NEW_PERSON && <></>}
        </AppDrawer>
      )}
    </Root>
  );
}

export const Person = React.memo(PersonFunc);
