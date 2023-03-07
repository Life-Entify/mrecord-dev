import { dummy } from "components/dummy";
import React, { useState } from "react";
import { Departments, DEPARTMENT_DRAWER_TYPES, IDepartment } from "ui";

interface IDepartmentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: DEPARTMENT_DRAWER_TYPES;
}
export default function DepartmentComponent() {
  const [state, _setState] = useState<Partial<IDepartmentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IDepartmentState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const [department, setDept] = useState<IDepartment>();
  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  return (
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
        dataSource: dummy.departments,
        editItem(dept) {
          setDept(dept);
          setState({
            openDrawer: true,
            drawerTitle: "Edit Department",
            dialogType: DEPARTMENT_DRAWER_TYPES.EDIT,
          });
        },
      }}
      newDepartmentProps={{}}
      editDepartmentProps={{
        department,
      }}
    />
  );
}
