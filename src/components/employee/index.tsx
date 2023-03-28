import { useDepartmentAction } from "components/departments/actions";
import { dummy } from "components/dummy";
import React, { useState } from "react";
import {
  INotificationTypes,
  INotifyObjectProps,
  notification,
  notifyObject,
  Staff,
  STAFF_DIALOG_TYPES,
} from "ui";
import { useEmployeeActions } from "./actions";
interface IStaffState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: STAFF_DIALOG_TYPES;
}

export default function StaffComponent() {
  const {
    employees,
    employee,
    existingPerson,
    setEmployee,
    updateProfile,
    createEmployee,
    createEmpWithPerson,
    createEmpWithNok,
  } = useEmployeeActions();
  const { departments } = useDepartmentAction();
  const [state, _setState] = useState<Partial<IStaffState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IStaffState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  // const [staff, setStaff] = useState<IEmployee>();
  const [api, contextHolder] = notification.useNotification();

  const closeDialog = (state?: Partial<IStaffState>) => {
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
      ...state,
    });
  };
  const openNotification = (
    type: INotificationTypes,
    props: INotifyObjectProps
  ) => {
    api[type](notifyObject(props));
  };
  return (
    <>
      {contextHolder}
      <Staff
        newEmpNotificationProps={{
          person: existingPerson?.person,
          description: (
            <div style={{ marginBottom: 20 }}>
              This profile was found, do you want to use this instead?
            </div>
          ),
          onBack: () =>
            setState({
              dialogType: STAFF_DIALOG_TYPES.NEW_STAFF,
            }),
          onUsePerson(person) {
            if (!person)
              return openNotification("error", {
                key: "no-person-to-create-patient",
                message: "Program Error",
                description: "Person object is undefined",
              });
            if (existingPerson?.who === "employee") {
              createEmpWithPerson(person, {
                notify: openNotification,
                onViewExistingPerson() {
                  api.destroy();
                  setState({
                    dialogType: STAFF_DIALOG_TYPES.PERSON_NOTIFICATION,
                    drawerTitle: "Existing Person",
                  });
                },
              }).then(() => closeDialog());
            } else {
              createEmpWithNok(person, {
                notify: openNotification,
              }).then(() => {
                closeDialog();
              });
            }
          },
        }}
        newStaffProps={{
          createPerson(info, error, options) {
            (async () => {
              if (error)
                return openNotification("error", {
                  message: "Create Patient Error",
                  description: error.message,
                  key: "create-patient-form-error",
                });
              if (info) {
                createEmployee(structuredClone(info), {
                  notify: openNotification,
                  onViewExistingPerson() {
                    api.destroy();
                    setState({
                      dialogType: STAFF_DIALOG_TYPES.PERSON_NOTIFICATION,
                      drawerTitle: "Existing Person",
                    });
                  },
                  onClose: () => api.destroy(),
                })
                  .then(() => {
                    options?.resetForm?.();
                    closeDialog();
                  })
                  .catch(() => {});
              }
            })();
          },
        }}
        toolbarProps={{
          newBtnProps: {
            title: "New Staff",
            onClick: () => {
              setState({
                openDrawer: true,
                drawerTitle: "New Staff",
                dialogType: STAFF_DIALOG_TYPES.NEW_STAFF,
              });
            },
          },
        }}
        tableProps={{
          dataSource: employees, // dummy.staff,
          rowSelection: {
            type: "radio",
            selectedRowKeys: [],
            onSelect(record) {
              setState({
                openDrawer: true,
                drawerTitle: `Staff (${record.person?.profile?.last_name})`,
                dialogType: STAFF_DIALOG_TYPES.STAFF_VIEW,
              });
              setEmployee(record, true, openNotification);
            },
          },
        }}
        drawerProps={{
          title: state.drawerTitle,
          open: state.openDrawer,
          drawerType: state.dialogType,
          onClose: () =>
            setState({
              openDrawer: false,
              drawerTitle: undefined,
              dialogType: undefined,
            }),
          size: "large",
        }}
        staffViewProps={{
          staff: employee,
          departments: departments,
          infoBoardProps: {
            skipMap: [
              "person",
              "profile",
              "next_of_kins",
              "next_of_kins_details",
            ],
          },
          staffDepartmentProps: {},
          staffAccountProps: {
            showNewBankForm() {
              setState({
                openDrawer: true,
                dialogType: STAFF_DIALOG_TYPES.NEW_BANK,
                drawerTitle: "Staff Bank",
              });
            },
            paymentTableProps: {
              payments: dummy.payments,
              removeColumns: ["employee_id", "tx_type"],
            },
          },
        }}
        newBankProps={{
          onBack() {
            setState({
              dialogType: STAFF_DIALOG_TYPES.STAFF_VIEW,
              drawerTitle: `Staff (${employee?.person?.profile?.last_name})`,
            });
          },
        }}
      />
    </>
  );
}
