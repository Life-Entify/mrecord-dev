import { QAddress, QPerson, QProfile } from "app/graph.queries/persons/types";
import React, { useCallback, useEffect, useState } from "react";
import { Patients, PATIENT_DIALOG_TYPE } from "ui/components/Patients";
import {
  IDisplayPatientRecord,
  IFormNextOfKin,
  IFormProfile,
} from "components/patients/types";
import { actionCreatePatient, actionRemoveNoks } from "./actions";
import {
  nextOfKinForm,
  patientDataMapping,
  patientForm,
  tableColumns,
} from "./data";
import {
  QNextOfKinData,
  QPatient,
  QUpdatePtProfileTransfer,
} from "app/graph.queries/patients/types";
import { INewPatientData } from "ui/components/Patients/NewPatient";
import { Button, notification, Space } from "ui/common";
import { WithPatient } from "components/base/hoc/with.patients";
import { INewPtNotificationProps } from "ui/components/Patients/NewPtNotification";
import moment from "moment";
import { fullAddress, spreadPatientData } from "app/common/common";
import { foundNewPatientNotification } from "./state.changes";

interface IPatientState<IFormProfile, IFormNextOfKin> {
  openDrawer: boolean;
  dialogType: PATIENT_DIALOG_TYPE;
  drawerTitle?: React.ReactNode;
  pagination?: { skip: number; limit: number };
  initialFormData?: INewPatientData<IFormProfile, IFormNextOfKin>;
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
  patients,
  createPerson,
}) {
  const [state, _setState] = useState<
    Partial<IPatientState<IFormProfile, IFormNextOfKin>>
  >({
    openDrawer: false,
  });
  const setState = (
    state: Partial<IPatientState<IFormProfile, IFormNextOfKin>>
  ) => _setState((_state) => ({ ..._state, ...state }));

  const [notifProps, setNotifProps] = useState<
    INewPtNotificationProps<keyof (QProfile & QPatient)>
  >({});

  const [formData, setFormData] =
    useState<INewPatientData<IFormProfile, IFormNextOfKin>>();

  const [patient, setPatient] = useState<QPatient>();

  const [api, contextHolder] = notification.useNotification();

  const [familyState, setFamilyState] = useState<{
    nextOfKins?: {
      person: QPerson;
      relationship: string;
    }[];
    members?: QPerson[];
  }>();

  const closeDialog = (
    state?: Partial<IPatientState<IFormProfile, IFormNextOfKin>>
  ) => {
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
      ...state,
    });
  };

  const [editProfileState, _setEditProfileState] = useState<{
    fieldChanges?: Partial<IFormProfile>;
  }>({ fieldChanges: {} });
  const setEditProfileState = (state: { fieldChanges?: IFormProfile }) =>
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
    info?: INewPatientData<IFormProfile, IFormNextOfKin>,
    error?: Error,
    options?: {
      resetForm: () => void;
    }
  ) => {
    const { resetForm } = options || {};
    if (info) {
      const clonedInfo = structuredClone(info);
      clonedInfo.profile = {
        ...clonedInfo.profile,
        dob: moment(clonedInfo.profile.dob.toString()).format("YYYY-MM-DD"),
      };
      clonedInfo.next_of_kins = clonedInfo.next_of_kins?.map(
        (i: IFormNextOfKin) => actionRemoveNoks(i)
      );
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

            let recPerson: IDisplayPatientRecord = {
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
            let recPerson: Record<keyof QProfile | keyof QPatient, string> = {
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
                data: recPerson,
                dataMap: patientDataMapping,
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
    (shouldSetPatient: boolean, record?: QPatient) => {
      if (shouldSetPatient) {
        setPatient(record);
        if (record?.next_of_kins && record.next_of_kins.length > 0) {
          const { next_of_kins } = record;
          getPersonsByID({
            variables: {
              _ids: next_of_kins?.map((nok) => nok.person_id),
            },
          }).then(
            ({ data }) => {
              if (data?.persons && data.persons.length > 0) {
                const noksCollection: QNextOfKinData[] = [];
                const { persons } = data;
                for (let i = 0; i < next_of_kins.length; i++) {
                  const nok = next_of_kins[i];
                  const p = persons?.find((p) => p._id === nok.person_id);
                  if (p)
                    noksCollection.push({
                      person: p,
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
    (values: IFormProfile) => {
      const changedFields: Partial<IFormProfile> & { addresses?: QAddress[] } =
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
          const value = values[key as keyof IFormProfile];
          if (addressFields.includes(key as keyof QAddress)) {
            if (addr?.[key as keyof QAddress] !== value) {
              cAddress[key as keyof QAddress] = value;
            }
          } else if (value !== profile?.[key as keyof QProfile]) {
            changedFields[key as keyof IFormProfile] = value;
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
        changeData.person_id = patient?.person._id;
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
      <Patients<
        IFormProfile,
        IFormNextOfKin,
        QPatient,
        keyof (QPatient & QProfile),
        QNextOfKinData,
        QPerson
      >
        tableProps={{
          scroll: { x: true },
          rowSelection: {
            // selections: true,
            onSelect(record) {
              displayPatientDetails(true, record);
            },
            selectedRowKeys: [],
            type: "radio",
          },
          columns: tableColumns,
          dataSource: patients?.map((p) => ({
            ...p,
            person: {
              ...p.person,
              profile: {
                ...p.person.profile,
                gender: p.person?.profile?.gender
                  ? p.person.profile.gender === "m"
                    ? "Male"
                    : "Female"
                  : "",
              },
            },
          })),
          size: "small",
          pagination: {
            total: 500,
          },
        }}
        newPtNotificationProps={notifProps}
        newPatientProps={{
          patientFormData: patientForm,
          nextOfKinFormData: nextOfKinForm,
          values: formData,
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
          profileFormData: patientForm,
          formProps: {
            name: "profile-edit-form",
            initialValues: {
              ...patient?.person?.profile,
              ...patient?.person?.profile?.addresses?.[0],
              old_id: patient?.old_id,
            } as IFormProfile,
            onChange(event) {
              const target = event.target as HTMLInputElement;
              const name = target.id.replace("profile-edit-form_", "");
              setEditProfileState({
                fieldChanges: {
                  ...editProfileState.fieldChanges,
                  [name]: target.value,
                } as IFormProfile,
              });
            },
            onFinish: onEditProfileFinish,
          },
        }}
        viewPatientProps={{
          patient: spreadPatientData(
            patient as QPatient
          ) as unknown as QPatient,
          title:
            patient &&
            patient.person.profile.last_name +
              " " +
              patient.person.profile.first_name,
          infoBoardProps: {
            descriptionProps: {
              layout: "vertical",
              title: "Bio Information",
              extra: (
                <Space>
                  <Button
                    onClick={() => {
                      setState({
                        openDrawer: true,
                        dialogType: PATIENT_DIALOG_TYPE.EDIT_PROFILE,
                        drawerTitle: (
                          <Space
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            Edit Profile
                            <Button
                              onClick={() => displayPatientDetails(false)}
                            >
                              Back to profile
                            </Button>
                          </Space>
                        ),
                      });
                      setPatient(patient);
                    }}
                  >
                    Edit
                  </Button>
                </Space>
              ),
            },
            dataMap: patientDataMapping,
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
              dataMap: patientDataMapping,
            },
          },
        }}
      />
    </>
  );
});
