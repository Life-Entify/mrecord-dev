import { dummy } from "components/dummy";
import React, { useState } from "react";
import {
  Departments,
  DEPARTMENT_DRAWER_TYPES,
  IDepartment,
  INotificationTypes,
  INotify,
  INotifyObjectProps,
  notification,
  notifyObject,
} from "ui";
import { useDepartmentAction } from "./actions";

interface IDepartmentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: DEPARTMENT_DRAWER_TYPES;
}
export default function DepartmentComponent() {
  const {
    departments,
    department,
    updateDepartment,
    createDepartment,
    setDepartment,
    deleteDepartment,
  } = useDepartmentAction();
  const [api, contextHolder] = notification.useNotification();
  const [state, _setState] = useState<Partial<IDepartmentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IDepartmentState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  const openNotification: INotify = (type, props) => {
    api[type](notifyObject(props));
  };
  return (
    <>
      {contextHolder}
      <Departments
        drawerProps={{
          drawerType: state.dialogType,
          title: state.drawerTitle,
          open: state.openDrawer,
          onClose: closeDialog,
        }}
        toolbarProps={{
          newBtnProps: {
            title: "New Department",
            onClick: () => {
              setState({
                openDrawer: true,
                dialogType: DEPARTMENT_DRAWER_TYPES.NEW_DEPARTMENT,
                drawerTitle: "New Department",
              });
            },
          },
        }}
        tableProps={{
          dataSource: departments,
          editItem(dept) {
            setDepartment(dept);
            setState({
              openDrawer: true,
              drawerTitle: "Edit Department",
              dialogType: DEPARTMENT_DRAWER_TYPES.EDIT,
            });
          },
          deleteItem(dept) {
            openNotification("warning", {
              key: "delete-dept-warning",
              message: "Confirm Delete",
              description: `Are sure you want to delete ${dept.name}?`,
              btn: [
                {
                  children: "Cancel",
                  onClick: () => api.destroy(),
                  type: "primary",
                },
                {
                  children: "Continue",
                  onClick() {
                    api.destroy("delete-dept-warning");
                    deleteDepartment(dept._id, { notify: openNotification });
                  },
                },
              ],
            });
          },
        }}
        newDepartmentProps={{
          onCreateItem(values) {
            createDepartment(values, { notify: openNotification }).then(() => {
              closeDialog();
            });
          },
        }}
        editDepartmentProps={{
          department,
          onUpdateItem(values) {
            updateDepartment(values, { notify: openNotification }).then(
              closeDialog
            );
          },
        }}
      />
    </>
  );
}
