import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DrawerProps, Space, Table, TableProps, Tabs, Tooltip } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { AppDrawer } from "ui/common/views/AppDrawer/AppDrawer";
import { ICheque, IOrgBank } from "../types";
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
  cheque?: ICheque;
  toolbarProps?: Omit<IToolbarProps, "extra">;
  drawerProps?: DrawerProps & { drawerType?: CHEQUE_DIALOG_TYPE };
  newChequeProps?: Omit<INewChequeProps, "cheque">;
  tableProps?: Omit<TableProps<ICheque>, "columns"> & {
    banks?: IOrgBank[];
    onEditCheque?: (cheque: ICheque) => void;
    onDeleteCheque?: (cheque: ICheque) => void;
  };
}

export function Cheques({
  cheque,
  drawerProps,
  toolbarProps,
  newChequeProps,
  tableProps,
}: IChequesProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { ...deepToolbarProps } = toolbarProps || {};
  const { banks, onEditCheque, onDeleteCheque, ...deepTableProps } =
    tableProps || {};
  return (
    <Root>
      {toolbarProps && <Toolbar {...deepToolbarProps} />}
      <Container>
        <Tabs>
          <Tabs.TabPane key={1} tab="All Booklets">
            <Table
              {...deepTableProps}
              columns={getChequeTableColumns(
                banks,
                undefined,
                (dataIndex) => (value, record, index) => {
                  if (dataIndex === "actions") {
                    return (
                      <Space>
                        <Tooltip title="Edit Cheque">
                          <EditOutlined
                            onClick={() => onEditCheque?.(record)}
                          />
                        </Tooltip>
                        <Tooltip title="Delete Cheque">
                          <DeleteOutlined
                            title="Delete"
                            onClick={() => onDeleteCheque?.(record)}
                          />
                        </Tooltip>
                      </Space>
                    );
                  }
                  return value;
                }
              )}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={2} tab="Used Booklets"></Tabs.TabPane>
        </Tabs>
        {/* <Table<IPatient> {...tableProps} /> */}
        <AppDrawer {...deepDrawerProps}>
          {drawerType === CHEQUE_DIALOG_TYPE.NEW_BOOKLET && (
            <NewCheque {...newChequeProps} cheque={cheque} isEdit={!!cheque}/>
          )}
        </AppDrawer>
      </Container>
    </Root>
  );
}
