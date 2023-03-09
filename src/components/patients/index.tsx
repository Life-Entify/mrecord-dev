import { QAddress } from "app/graph.queries/persons/types";
import React, { useCallback, useEffect, useState } from "react";
import { Patients, PATIENT_DIALOG_TYPE } from "ui/components/Patients";
import { actionCreatePatient } from "./actions";
import { Button, notification, Space } from "ui/common";
import { WithPatient } from "components/base/hoc/with.patients";
import { INewPtNotificationProps } from "ui/components/Patients/NewPtNotification";
import moment from "moment";
import { foundNewPatientNotification } from "./state.changes";
import { IFormPatient, IPatient } from "ui/components/Patients/types";
import {
  fullAddress,
  IFamilyMemberDetails,
  INewPersonData,
  INextOfKinDetails,
  IProfile,
} from "ui/components/Person";
import { QUpdatePtProfileTransfer } from "app/graph.queries/patients/types";
import { dummy } from "components/dummy";
interface IPatientState {
  openDrawer: boolean;
  dialogType: PATIENT_DIALOG_TYPE;
  drawerTitle?: React.ReactNode;
  pagination?: { skip: number; limit: number };
}
interface INotificationProps {
  key: React.Key;
  message: React.ReactNode;
  description?: React.ReactNode;
  btn?: React.ReactNode;
  onClose?: () => void;
  duration?: number;
}

export default WithPatient(function PatientComponent({
  getPatients,
  getPersons,
  getPersonsByID,
  createPatient,
  updatePatient,
  createPatientMD,
  // dummy.patients,
  createPerson,
}) {
  const [state, _setState] = useState<Partial<IPatientState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPatientState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  const [notifProps, setNotifProps] = useState<INewPtNotificationProps>({});

  const [formData, setFormData] = useState<INewPersonData<IFormPatient>>();

  const [patient, setPatient] = useState<IPatient>();

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

  const [editProfileState, _setEditProfileState] = useState<{
    fieldChanges?: Partial<IFormPatient>;
  }>({ fieldChanges: {} });
  const setEditProfileState = (state: { fieldChanges?: IFormPatient }) =>
    _setEditProfileState((_state) => ({ ..._state, ...state }));
  const openNotification = ({
    message,
    description,
    onClose,
    duration,
    key,
    btn,
  }: INotificationProps) => {
    api.error({
      message,
      description,
      onClose,
      duration,
      key,
      btn,
    });
  };
  const handleCreatePatient = async (
    info?: INewPersonData<IFormPatient>,
    error?: Error,
    options?: {
      resetForm: () => void;
    }
  ) => {
    const { resetForm } = options || {};
    if (info) {
      const clonedInfo = structuredClone(info) as INewPersonData<IFormPatient>;
      clonedInfo.profile = {
        ...clonedInfo.profile,
        dob: moment(clonedInfo.profile.dob.toString()).format("YYYY-MM-DD"),
      };
      if (
        clonedInfo.profile.phone_number ===
        clonedInfo.next_of_kins?.[0]?.phone_number
      ) {
        return openNotification({
          key: "patient-nok-same-number-error",
          message: "Same Phone Number Error",
          description:
            "Patient and next of kin can't share the same phone number!",
        });
      }
      const createError = await actionCreatePatient({
        getPersons,
        getPatients,
        createPatient,
        info: clonedInfo,
      });
      if (createError) {
        const cause = createError.cause;
        openNotification({
          key: createError.message + cause?.label,
          message: cause?.label,
          description: createError?.message,
        });
        if (!cause?.data) return;

        switch (cause?.code) {
          case 1: {
            setState({
              openDrawer: true,
              dialogType: PATIENT_DIALOG_TYPE.PATIENT_NOTIFICATION,
              drawerTitle: "New Patient Error",
            });
            let cPerson = structuredClone(cause.data?.result?.profile);

            let recPerson = {
              ...cPerson,
              addresses:
                cPerson.addresses?.[0] && fullAddress(cPerson.addresses[0]),
            };
            setNotifProps(
              foundNewPatientNotification({
                title: cause?.label,
                description: createError.message,
                onClick: () => {
                  setFormData(info);
                  setState({
                    openDrawer: true,
                    dialogType: PATIENT_DIALOG_TYPE.NEW_PATIENT,
                    drawerTitle: "New Patient - Edit",
                  });
                },
                person: recPerson,
              })
            );
            break;
          }
          case 2: {
            setState({
              openDrawer: true,
              dialogType: PATIENT_DIALOG_TYPE.PATIENT_NOTIFICATION,
              drawerTitle: "New Patient Error",
            });
            let cPerson = structuredClone(cause.data?.result?.profile);
            let recPerson: Record<keyof (IProfile & IPatient), string> = {
              ...cPerson,
              addresses:
                cPerson.addresses?.[0] && fullAddress(cPerson.addresses[0]),
            };
            setNotifProps({
              title: cause?.label,
              description: createError.message,
              infoBoardProps: {
                title: recPerson.last_name + " " + recPerson.first_name,
                descriptionProps: {
                  extra: (
                    <Space>
                      <Button
                        onClick={() => {
                          setFormData(info);
                          setState({
                            openDrawer: true,
                            dialogType: PATIENT_DIALOG_TYPE.NEW_PATIENT,
                            drawerTitle: "New Next of Kin - Edit",
                          });
                        }}
                      >
                        Edit Profile
                      </Button>
                      <Button type="primary">Use found profile</Button>
                    </Space>
                  ),
                },
              },
            });
            break;
          }
        }
        return;
      }
      setState({ openDrawer: false, dialogType: undefined });
      resetForm?.();
      getPatients();
    } else {
      // handle undefined for info that includes err (if any)
      if (error) {
        //TODO: notification
      }
    }
  };
  useEffect(() => {
    getPatients({
      variables: {
        limit: 100,
      },
    });
    // handleCreatePatient(
    //   JSON.parse(
    //     '{"profile":{"last_name":"Agu","first_name":"Chijioke","middle_name":"Chima","gender":"m","old_id":"01","national_identity":"1234","occupation":"Physiotherapist","dob":"2023-02-07T10:33:49.272Z","email":"chokey2nv@gmail.com","phone_number":"+2348064668635","street":"IC7 Africa, 18 Manzini Street","town":"Abuja","lga":"owerri-north","nstate":"Abuja","country":"Nigeria"},"nextOfKins":[{"nok_last_name":"Agu","nok_first_name":"Chijioke","nok_phone_number":"+2348064668635","nok_email":"chokey2nv@gmail.com","nok_relationship":"father","nok_street":"IC7 Africa, 18 Manzini Street","nok_town":"Abuja","nok_nstate":"Abuja","nok_country":"Nigeria"}]}'
    //   )
    // );
  }, []);
  const displayPatientDetails = useCallback(
    (shouldSetPatient: boolean, record?: IPatient) => {
      if (shouldSetPatient) {
        setPatient(record);
        const { next_of_kins } = record?.person || {};
        if (next_of_kins && next_of_kins.length > 0) {
          getPersonsByID({
            variables: {
              _ids: next_of_kins?.map((nok) => nok.person_id),
            },
          }).then(
            ({ data }) => {
              if (data?.persons && data.persons.length > 0) {
                const noksCollection: INextOfKinDetails[] = [];
                const { persons } = data;
                for (let i = 0; i < next_of_kins.length; i++) {
                  const nok = next_of_kins[i];
                  const p = persons?.find((p) => p._id === nok.person_id);
                  if (p)
                    noksCollection.push({
                      next_of_kin: p,
                      relationship: nok.relationship,
                    });
                }
                setFamilyState({ nextOfKins: noksCollection });
              }
            },
            (cause) => {
              openNotification({
                key: "notification-can-not-get-family-nok",
                message: "Get Family Error",
                description: cause as React.ReactNode,
              });
            }
          );
        }
      }
      setState({
        openDrawer: true,
        dialogType: PATIENT_DIALOG_TYPE.VIEW_PATIENT,
        drawerTitle: "Patient's Data Page",
      });
    },
    [JSON.stringify(patient)]
  );
  const onEditProfileFinish = useCallback(
    (values: IFormPatient) => {
      const changedFields: Partial<IFormPatient> & { addresses?: QAddress[] } =
        {};
      const addressFields: (keyof QAddress)[] = [
        "street",
        "town",
        "lga",
        "nstate",
        "country",
      ];
      const profile = patient?.person?.profile;
      const addr = patient?.person?.profile?.addresses[0];
      const cAddress: Partial<QAddress> = {};
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key as keyof IFormPatient];
          if (addressFields.includes(key as keyof QAddress)) {
            if (addr?.[key as keyof QAddress] !== value) {
              cAddress[key as keyof QAddress] = value;
            }
          } else if (value !== profile?.[key as keyof IProfile]) {
            changedFields[key as keyof IFormPatient] = value;
          }
        }
      }
      if (Object.keys(changedFields).length === 0) {
        return openNotification({
          message: "No changes made",
          key: "no-edit-changes",
        });
      }

      if (Object.keys(cAddress).length > 0) {
        cAddress._id = profile?.addresses?.[0]._id;
        changedFields.addresses = [cAddress as QAddress];
      }
      const changeData: QUpdatePtProfileTransfer = {};
      if (changedFields.old_id) {
        changeData._id = patient?._id;
        changeData.patient = {
          old_id: changedFields.old_id,
        };
        delete changedFields.old_id;
      }
      if (Object.keys(changedFields).length > 0) {
        changeData.person_id = patient?.person?._id;
        changeData.profile = changedFields;
      }
      updatePatient({
        variables: changeData,
      })
        .then(() => {
          closeDialog();
          getPatients();
        })
        .catch((cause) => {
          openNotification({
            key: "open-notif-update-pt-error",
            message: cause,
          });
        });
    },
    [JSON.stringify(editProfileState.fieldChanges), JSON.stringify(patient)]
  );
  return (
    <>
      {contextHolder}
      <Patients
        tableProps={{
          rowSelection: {
            // selections: true,
            onSelect(record) {
              displayPatientDetails(true, record);
            },
            selectedRowKeys: [],
            type: "radio",
          },
          dataSource: dummy.patients,
          size: "small",
          pagination: {
            total: 500,
          },
        }}
        newPtNotificationProps={notifProps}
        newPatientProps={{
          createPatient: handleCreatePatient,
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
          onBack: () => displayPatientDetails(false),

          // onFinish,
        }}
        viewPatientProps={{
          patient,
          onShowEditPage(patient) {
            setState({
              dialogType: PATIENT_DIALOG_TYPE.EDIT_PROFILE,
              drawerTitle: "Profile Edit",
              // drawerTitle: (
              //   <Space
              //     style={{
              //       display: "flex",
              //       justifyContent: "space-between",
              //     }}
              //   >
              //     Edit Profile
              //     <Button
              //       onClick={() => displayPatientDetails(false)}
              //     >
              //       Back to profile
              //     </Button>
              //   </Space>
              // ),
            });
            setPatient(patient);
          },
          infoBoardProps: {
            descriptionProps: {
              layout: "vertical",
              title: "Bio Information",
            },
          },
          familyProps: {
            familyMembers: {
              nextOfKins: familyState?.nextOfKins,
              members: familyState?.members,
            },
            infoBoardProps: {
              replaceMap(value, key, data) {
                if (key === "addresses") {
                  return fullAddress((value as any)?.[0] as QAddress);
                }
                return value;
              },
            },
          },
        }}
      />
    </>
  );
});
