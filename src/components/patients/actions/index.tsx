import { usePatient } from "app/graph.hooks/patient";
import { usePerson } from "app/graph.hooks/person";
import {
  QPatientQueryParams,
  QUpdatePtProfileTransfer,
} from "app/graph.queries/patients/types";
import { INotificationProps } from "components/types";
import React, { useCallback, useEffect, useState } from "react";
import { AppError, INotificationTypes, INotifyObjectProps } from "ui";
import { IFormPatient, IPatient } from "ui/components/Patients/types";
import {
  formToPerson,
  IFamilyMemberDetails,
  INewPersonData,
  INextOfKinDetails,
  IPerson,
} from "ui/components/Person";
import { actionCreatePatient } from "./create.patient";

export const usePatientActions = () => {
  const { getPatients, updatePatient, createPatient } = usePatient();
  const { getPersonsByID, getPersons, createPerson } = usePerson();
  const [ptQueryParams, setPtQueryParams] = useState<QPatientQueryParams>({
    skip: 0,
    limit: 100,
  });
  const [patients, setPatients] = useState<IPatient[]>();
  const [patient, setPatient] = useState<IPatient>();
  const [family, setFamily] = useState<{
    nextOfKins?: INextOfKinDetails[];
    members?: IFamilyMemberDetails[];
  }>();
  const [newPtFormData, setNewPtFormData] =
    useState<INewPersonData<IFormPatient>>();
  const [existingPerson, setExistingPerson] = useState<{
    person: IPerson;
    who: "next_of_kin" | "patient";
  }>();

  const setPatientAndGetFamily = (
    record: IPatient,
    getFamily: boolean,
    notify: (type: INotificationTypes, props: INotifyObjectProps) => void
  ) => {
    setPatient(record);
    if (!getFamily) return;
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
              const p = persons?.find((p) => p.person_id === nok.person_id);
              if (p)
                noksCollection.push({
                  next_of_kin: p,
                  relationship: nok.relationship,
                });
            }
            setFamily({ nextOfKins: noksCollection });
          }
        },
        (cause) => {
          notify("error", {
            key: "notification-can-not-get-family-nok",
            message: "Get Family Error",
            description: cause as React.ReactNode,
          });
        }
      );
    }
  };

  const updateProfile = useCallback(
    async (
      formPatient: Partial<IFormPatient>,
      notify: (type: INotificationTypes, props: INotifyObjectProps) => void
    ) => {
      const { old_id, ...profile } = formPatient || {};
      const updateData: QUpdatePtProfileTransfer = {};
      if (old_id) {
        updateData._id = patient?._id;
        updateData.patient = { old_id };
      }
      if (
        JSON.stringify(patient?.person?.profile) !== JSON.stringify(profile)
      ) {
        updateData.person_xid = patient?.person?._id;
        updateData.profile = formToPerson(
          patient?.person?.profile?.addresses?.[0]?._id || "address1",
          profile as IFormPatient
        );
      }
      await updatePatient({
        variables: updateData,
      });
      const { data: ptData } = await getPatients({
        variables: ptQueryParams,
      });
      setPatients(ptData?.patients);
      const pt = ptData?.patients?.find((item) => item._id === patient?._id);
      if (pt) {
        setPatient(pt);
      }
      notify("success", {
        message: "Successful Update",
        description: "Profile updated successfully",
        key: "update-profile-success",
      });
    },
    [JSON.stringify(patient)]
  );

  const createPt = async (
    info: INewPersonData<IFormPatient>,
    {
      notify,
      onViewExistingPerson,
      onClose,
    }: {
      notify: (type: INotificationTypes, props: INotifyObjectProps) => void;
      onViewExistingPerson?: () => void;
      onClose: () => void;
    }
  ) => {
    try {
      const newPt = await actionCreatePatient({
        getPersons,
        createPerson,
        getPatients,
        createPatient,
        info,
      });
      await getPatients();
      notify("success", {
        key: "create-pt-success",
        message: "Patient created!",
        description: `patient with Patient ID ${newPt.patient_id} created!`,
      });
    } catch (e) {
      const error = e as AppError<IPerson>;
      if (error.cause?.code === 0)
        notify("error", {
          key: "create-pt-error",
          message: "Create Patient Error",
          description: (e as Error).message,
        });
      else if (error.cause?.code === 1) {
        const { data: person } = error?.cause || {};
        const { last_name, phone_number } = error.cause?.data?.profile || {};
        setExistingPerson({ person: person as IPerson, who: "patient" });
        setNewPtFormData(info);
        notify("error", {
          key: "create-pt-select-error",
          message: "Existing person!",
          description: `We found the name (${last_name}) with this phone number ${phone_number}. Do you want to use this profile instead?`,
          btn: [
            { children: "Close", onClick: onClose },
            {
              children: "View Profile",
              type: "primary",
              onClick: onViewExistingPerson,
            },
          ],
        });
      } else if (error.cause?.code === 2) {
        const { data: person } = error?.cause || {};
        const { last_name, phone_number } = error.cause?.data?.profile || {};
        setExistingPerson({ person: person as IPerson, who: "next_of_kin" });
        notify("error", {
          key: "create-pt-select-error",
          message: "Existing Next of Kin!",
          description: `We found the name (${last_name}) with this phone number ${phone_number}. Do you want to use this profile instead?`,
          btn: [
            { children: "Close", onClick: onClose },
            {
              children: "View Profile",
              type: "primary",
              onClick: onViewExistingPerson,
            },
          ],
        });
      }
      throw e;
    }
  };
  const createPtWithPerson = useCallback(
    (person: IPerson) => {
      
    },
    [JSON.stringify(newPtFormData)]
  );
  useEffect(() => {
    getPatients({
      variables: ptQueryParams,
    });
  }, [JSON.stringify(ptQueryParams)]);
  useEffect(() => {
    (async () => {
      const { data } = await getPatients({
        variables: ptQueryParams,
      });
      setPatients(data?.patients);
    })();
  }, []);

  return {
    patients,
    patient,
    family,
    existingPerson,
    newPtFormData,
    setPatient: setPatientAndGetFamily,
    updateProfile,
    createPatient: createPt,
    createPtWithPerson,
  };
};
