import { DrawerProps, Space, Table, TableProps, Tooltip } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { AppDrawer } from "ui/common/views/AppDrawer/AppDrawer";
import { getDepartmentTableColumns } from "./data";
import { INewDepartmentProps, NewDepartment } from "./NewDepartment";
import { IDepartment } from "./types";

const Root = styled.div``;
const TableContainer = styled.div`
  margin-top: 20px;
`;

export enum DEPARTMENT_DRAWER_TYPES {
  NEW_DEPARTMENT,
  EDIT,
}
export interface IDepartmentProps {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & {
    drawerType?: DEPARTMENT_DRAWER_TYPES;
  };
  newDepartmentProps?: Omit<INewDepartmentProps, "isEdit">;
  editDepartmentProps?: Omit<INewDepartmentProps, "isEdit" | "onCreateItem"> & {
    onUpdateItem?: (values: Partial<IDepartment>) => void;
  };
  tableProps?: Omit<TableProps<IDepartment>, "columns"> & {
    deleteItem?: (dept: IDepartment) => void;
    editItem?: (dept: IDepartment) => void;
  };
}

function DepartmentFunc({
  toolbarProps,
  drawerProps,
  newDepartmentProps,
  editDepartmentProps,
  tableProps,
}: IDepartmentProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { editItem, deleteItem, ...deepTableProps } = tableProps || {};
  const { onUpdateItem, ...deepEditDepartmentProps } =
    editDepartmentProps || {};
  const appDeptKes = ["Records", "HR", "Accounts"];
  return (
    <Root>
      {toolbarProps && <Toolbar {...toolbarProps} />}
      <TableContainer>
        <Table
          {...deepTableProps}
          columns={getDepartmentTableColumns((keyIndex) => (value, record) => {
            if (keyIndex === "action" && !appDeptKes.includes(record.name)) {
              return (
                <Space>
                  <Tooltip title="Edit">
                    <EditOutlined onClick={() => editItem?.(record)} />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <DeleteOutlined onClick={() => deleteItem?.(record)} />
                  </Tooltip>
                </Space>
              );
            }
            return value;
          })}
        />
      </TableContainer>
      <AppDrawer {...deepDrawerProps}>
        {drawerType === DEPARTMENT_DRAWER_TYPES.NEW_DEPARTMENT && (
          <NewDepartment {...newDepartmentProps} />
        )}
        {drawerType === DEPARTMENT_DRAWER_TYPES.EDIT && (
          <NewDepartment
            {...deepEditDepartmentProps}
            isEdit
            onCreateItem={onUpdateItem}
          />
        )}
      </AppDrawer>
    </Root>
  );
}

export const Departments = React.memo(DepartmentFunc);
