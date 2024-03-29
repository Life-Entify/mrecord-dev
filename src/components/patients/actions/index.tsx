import { usePatient } from "app/graph.hooks/patient";
import { usePerson } from "app/graph.hooks/person";
import {
  QNextOfKins,
  QPatientQueryParams,
  QTransferPtWithMeta,
  QTransferPtWithNok,
  QUpdatePtProfileTransfer,
} from "app/graph.queries/patients/types";
import React, { useCallback, useEffect, useState } from "react";
import { AppError, INotificationTypes, INotifyObjectProps } from "ui";
import { IFormPatient, IPatient } from "ui/components/Patients/types";
import {
  formToPerson,
  IFamilyMemberDetails,
  IFormNextOfKinData,
  INewPersonData,
  INextOfKin,
  INextOfKinDetails,
  IPerson,
  IProfile,
} from "ui/components/Person";
import { createErrorHandler } from "./create.error.handler";
import { useCreatePatientAction } from "./create.patient";
import { useCreatePatientWithMeta } from "./create.pt.wt.meta";
import { useCreatePatientWithNok } from "./create.pt.wt.nok";
import { useCreatePatientWithPerson } from "./create.pt.wt.person";

export interface IExistingPersonState {
  person: IPerson;
  who: "next_of_kin" | "patient";
}
export type INotify = (
  type: INotificationTypes,
  props: INotifyObjectProps
) => void;
export const usePatientActions = () => {
  const { getPatients, updatePatient } = usePatient();
  const { createPatient } = useCreatePatientAction();
  const { createPtWithPerson } = useCreatePatientWithPerson();
  const { createPatientWithNok } = useCreatePatientWithNok();
  const { createPatientWithMeta } = useCreatePatientWithMeta();
  const { getPersonsByPersonID, getPersons, createPerson } = usePerson();
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
  const [existingPerson, setExistingPerson] = useState<IExistingPersonState>();
  const [patientData, setPtData] = useState<INewPersonData<IFormPatient>>();

  const setPatientAndGetFamily = (
    record: IPatient,
    getFamily: boolean,
    notify: INotify
  ) => {
    setPatient(record);
    if (!getFamily) return;
    const { next_of_kins } = record?.person || {};
    if (next_of_kins && next_of_kins.length > 0) {
      getPersonsByPersonID({
        variables: {
          ids: next_of_kins?.map((nok) => nok.person_id),
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
      notify: INotify;
      onViewExistingPerson?: () => void;
      onClose: () => void;
    }
  ) => {
    try {
      const newPt = await createPatient(structuredClone(info));
      await getPatients();
      notify("success", {
        key: "create-pt-success",
        message: "Patient created!",
        description: `patient with Patient ID ${newPt?.patient_id} created!`,
      });
    } catch (e) {
      const error = e as AppError<IPerson>;
      if (error.cause?.code !== 0) {
        setNewPtFormData(info);
      }
      createErrorHandler(structuredClone(info), error, {
        setExistingPerson,
        onClose,
        onViewExistingPerson,
        notify,
      });
      throw e;
    }
  };
  const createPtWPerson = useCallback(
    async (
      person: IPerson,
      {
        notify,
        onViewExistingPerson,
      }: {
        notify: (type: INotificationTypes, props: INotifyObjectProps) => void;
        onViewExistingPerson?: () => void;
      }
    ) => {
      const updatedInfo = {
        person_id: person.person_id,
        old_id: newPtFormData?.profile?.old_id as string,
        next_of_kins: newPtFormData?.next_of_kins as QNextOfKins[],
      };
      try {
        const newPt = await createPtWithPerson(updatedInfo);
        const { data: updatedPtData } = await getPatients({});
        const newPts = updatedPtData?.patients;
        setPatients(newPts);
        notify("success", {
          key: "create-pt-success",
          message: "Patient created!",
          description: `patient with Patient ID ${newPt?.patient_id} created!`,
        });
      } catch (e) {
        const error = e as AppError<IPerson>;
        if (error.cause?.code === 2) {
          setPtData(updatedInfo);
        }
        createErrorHandler(
          newPtFormData as INewPersonData<IFormPatient>,
          error,
          {
            setExistingPerson,
            notify,
            onViewExistingPerson,
          }
        );
        throw error;
      }
    },
    [JSON.stringify(newPtFormData)]
  );
  const createPtWNok = useCallback(
    async (person: IPerson, { notify }: { notify: INotify }) => {
      try {
        if (patientData?.person_id) {
          // run meta
          const newPt = await createPatientWithMeta({
            person_id: patientData?.person_id,
            old_id: patientData?.old_id as string,
            next_of_kins: [
              {
                relationship: newPtFormData?.next_of_kins?.[0].relationship,
                person_id: person?.person_id,
              } as INextOfKin,
            ],
          });
          const { data: updatedPtData } = await getPatients({});
          const newPts = updatedPtData?.patients;
          setPatients(newPts);
          notify("success", {
            key: "create-pt-success",
            message: "Patient created!",
            description: `patient with Patient ID ${newPt?.patient_id} created!`,
          });
        } else {
          const newPt = await createPatientWithNok({
            profile: newPtFormData?.profile as IFormPatient,
            next_of_kins: [
              {
                relationship: newPtFormData?.next_of_kins?.[0].relationship,
                person_id: person?.person_id,
              } as INextOfKin,
            ],
          });
          const { data: updatedPtData } = await getPatients({});
          const newPts = updatedPtData?.patients;
          setPatients(newPts);
          notify("success", {
            key: "create-pt-success",
            message: "Patient created!",
            description: `patient with Patient ID ${newPt?.patient_id} created!`,
          });
        }
      } catch (e) {
        notify("error", {
          key: "create-pt-nok-error",
          message: "Create Patient Error",
          description: (e as Error).message,
        });
      }
    },
    [JSON.stringify(patientData), JSON.stringify(newPtFormData)]
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
    createPtWithPerson: createPtWPerson,
    createPtWithNok: createPtWNok,
  };
};
