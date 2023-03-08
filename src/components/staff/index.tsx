import { dummy } from "components/dummy";
import { useState } from "react";
import { IStaff, Staff, STAFF_DIALOG_TYPES } from "ui";
interface IStaffState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: STAFF_DIALOG_TYPES;
}

export default function StaffComponent() {
  const [state, _setState] = useState<Partial<IStaffState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IStaffState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const [staff, setStaff] = useState<IStaff>();
  return (
    <Staff
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
        dataSource: dummy.staff,
        rowSelection: {
          type: "radio",
          selectedRowKeys: [-1],
          onSelect(record) {
            setState({
              openDrawer: true,
              drawerTitle: `Staff (${record.person?.profile?.last_name})`,
              dialogType: STAFF_DIALOG_TYPES.STAFF_VIEW,
            });
            setStaff(record);
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
        staff,
        departments: dummy.departments,
        infoBoardProps: {
          skipMap: [
            "person",
            "profile",
            "next_of_kins",
            "next_of_kins_details",
          ],
        },
        staffDepartmentProps:{
          
        },
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
            removeColumns: ["staff_id", "tx_type"],
          },
        },
      }}
      newBankProps={{
        onBack() {
          setState({
            dialogType: STAFF_DIALOG_TYPES.STAFF_VIEW,
            drawerTitle: `Staff (${staff?.person?.profile?.last_name})`,
          });
        },
      }}
    />
  );
}
