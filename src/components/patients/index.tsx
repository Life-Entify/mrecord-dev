import React, { useState } from "react";
import { Patients, PATIENT_DIALOG_TYPE } from "ui/components/Patients";
import {
  INotificationTypes,
  INotifyObjectProps,
  notification,
  notifyObject,
} from "ui/common";
import {
  IFamilyMemberDetails,
  INextOfKinDetails,
} from "ui/components/Person";
import { usePatientActions } from "./actions";
interface IPatientState {
  openDrawer: boolean;
  dialogType: PATIENT_DIALOG_TYPE;
  drawerTitle?: React.ReactNode;
  pagination?: { skip: number; limit: number };
}

export default function PatientComponent() {
  const {
    patients,
    patient,
    existingPerson,
    setPatient,
    updateProfile,
    createPatient,
    createPtWithPerson,
    createPtWithNok,
  } = usePatientActions();

  const [state, _setState] = useState<Partial<IPatientState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPatientState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  const [api, contextHolder] = notification.useNotification();

  const [familyState, setFamilyState] = useState<{
    nextOfKins?: INextOfKinDetails[];
    members?: IFamilyMemberDetails[];
  }>();

  const closeDialog = (state?: Partial<IPatientState>) => {
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
      <Patients
        tableProps={{
          rowSelection: {
            onSelect(record) {
              setState({
                openDrawer: true,
                dialogType: PATIENT_DIALOG_TYPE.VIEW_PATIENT,
                drawerTitle: "Patient's Data Page",
              });
              setPatient(record, true, openNotification);
            },
            selectedRowKeys: [],
            type: "radio",
          },
          dataSource: patients,
          size: "small",
          pagination: {
            total: 500,
          },
        }}
        newPtNotificationProps={{
          person: existingPerson?.person,
          description: (
            <div style={{ marginBottom: 20 }}>
              This profile was found, do you want to use this instead?
            </div>
          ),
          onBack: () =>
            setState({
              dialogType: PATIENT_DIALOG_TYPE.NEW_PATIENT,
            }),
          onUsePerson(person) {
            if (!person)
              return openNotification("error", {
                key: "no-person-to-create-patient",
                message: "Program Error",
                description: "Person object is undefined",
              });
            if (existingPerson?.who === "patient") {
              createPtWithPerson(person, {
                notify: openNotification,
                onViewExistingPerson() {
                  api.destroy();
                  setState({
                    dialogType: PATIENT_DIALOG_TYPE.PATIENT_NOTIFICATION,
                    drawerTitle: "Existing Person",
                  });
                },
              }).then(() => closeDialog());
            } else {
              createPtWithNok(person, {
                notify: openNotification,
              }).then(() => {
                closeDialog();
              });
            }
          },
        }}
        newPatientProps={{
          // values: {
          //   profile: patientToForm(dummy.patients?.[0]) as IFormPatient,
          //   next_of_kins: dummy.patients?.[0].person?.next_of_kins?.map(
          //     (nok) => ({
          //       relationship: nok.relationship,
          //       ...patientToForm({ person: dummy.patients?.[0]?.person }),
          //     })
          //   ) as IFormNextOfKinData[],
          // },
          createPatient(info, error, options) {
            (async () => {
              if (error)
                return openNotification("error", {
                  message: "Create Patient Error",
                  description: error.message,
                  key: "create-patient-form-error",
                });
              if (info) {
                createPatient(structuredClone(info), {
                  notify: openNotification,
                  onViewExistingPerson() {
                    api.destroy();
                    setState({
                      dialogType: PATIENT_DIALOG_TYPE.PATIENT_NOTIFICATION,
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
            onClick: () =>
              setState({
                openDrawer: true,
                dialogType: PATIENT_DIALOG_TYPE.NEW_PATIENT,
                drawerTitle: "New Patient",
              }),
            title: "New Patient",
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
        editProfileProps={{
          patient,
          onBack: () =>
            setState({
              dialogType: PATIENT_DIALOG_TYPE.VIEW_PATIENT,
              drawerTitle: "Patient's Data Page",
            }),
          updateProfile(info, error, options) {
            if (info) {
              updateProfile(info, openNotification);
              options?.resetForm?.();
              setState({
                dialogType: PATIENT_DIALOG_TYPE.VIEW_PATIENT,
                drawerTitle: "Patient's Data Page",
              });
            }
          },
          // onFinish,
        }}
        viewPatientProps={{
          patient,
          onShowEditPage() {
            setState({
              dialogType: PATIENT_DIALOG_TYPE.EDIT_PROFILE,
              drawerTitle: "Profile Edit",
            });
          },
          familyProps: {
            familyMembers: {
              nextOfKins: familyState?.nextOfKins,
              members: familyState?.members,
            },
          },
        }}
      />
    </>
  );
}
