import React from "react";
// import { ApolloError } from "@apollo/client";
// import { AppError } from "ui";
// import {
//   QTransferPatient,
//   QTransferPtWithPerson,
// } from "app/graph.queries/patients/types";
// import { IWithPatientProps } from "components/base/hoc/with.patients";
// import {
//   IAddress,
//   IFormNextOfKin,
//   IFormPerson,
//   INewPersonData,
//   IProfile,
//   IPerson,
// } from "ui/components/Person";
// import { IFormPatient } from "ui/components/Patients/types";
// import {
//   patientFormRefactor,
//   actionRemoveNoks,
// } from "ui/components/Person/common";

// type IActionCreatePatientNokMDProps = Pick<
//   IWithPatientProps,
//   "getPersons" | "createPtWithPerson" | "createPerson"
// > & {
//   info: Pick<QTransferPatient, "oldId" | "profile"> &
//     Pick<QTransferPtWithPerson, "next_of_kins">;
// };
// export async function actionCreatePatientWithNokMD({
//   createPerson,
//   createPtWithPerson,
//   info,
// }: IActionCreatePatientNokMDProps): Promise<AppError<IPerson> | null> {
//   try {
//     const { profile, oldId, next_of_kins } = info;
//     const { data } = await createPerson({
//       variables: {
//         profile: profile as IProfile,
//       },
//     });
//     if (!data?.person?.person_id) {
//       return new AppError("Error", {
//         cause: {
//           code: 0,
//           label: "Error: Create new patient",
//         },
//       });
//     }
//     // createPtWithPerson({
//     //   variables: {
//     //     person_id: data?.person.person_id,
//     //     oldId,
//     //     next_of_kins,
//     //   },
//     // });
//     return null;
//   } catch (err) {
//     if (err instanceof ApolloError) {
//       return new AppError<IPerson>((err as ApolloError).message, {
//         cause: { code: 1, label: "User Exists" },
//       });
//     }
//     return err as AppError<IPerson>;
//   }
// }
// type IActionCreatePatientMetaProps = Pick<
//   IWithPatientProps,
//   "getPersons" | "createPtWithPerson" | "createPerson"
// > & {
//   info: Omit<QTransferPatient, "profile"> & { person_id: string };
// };
// export async function actionCreatePatientWithMD({
//   getPersons,
//   createPerson,
//   createPtWithPerson,
//   info,
// }: IActionCreatePatientMetaProps): Promise<AppError<IPerson> | null> {
//   try {
//     const { person_id, oldId, next_of_kins } = info;

//     const nokPhone = next_of_kins[0].next_of_kin.phone_number;
//     if (!nokPhone) {
//       throw new AppError(`Next of kin phone number missing`, {
//         cause: {
//           code: 0,
//           label: "Next of Kin Profile Error",
//         },
//       });
//     }
//     const { data: personData, error: pError } = await getPersons({
//       variables: {
//         keyword: {
//           profile: {
//             phone_number: nokPhone,
//           },
//         },
//       },
//     });
//     const { persons: personsWithPhone } = personData || {};
//     if (personsWithPhone?.[0] || pError) {
//       throw new AppError(
//         pError?.message ||
//           `I found next of kin with phone number ${nokPhone}, do you want to use him/her instead?`,
//         {
//           cause: {
//             code: pError ? 0 : 2,
//             label: "Existing Next of kin",
//             data: personsWithPhone?.[0],
//           },
//         }
//       );
//     }
//     //create person (next of kin) and use the person_id
//     const noks = await Promise.allSettled(
//       next_of_kins.map((nok) =>
//         createPerson({
//           variables: {
//             profile: nok.next_of_kin as IProfile,
//           },
//         })
//       )
//     );
//     const successfulReq: { index: number; person: IPerson }[] = [];
//     const failedReq = [];
//     for (let i = 0; i < noks.length; i++) {
//       const req = noks[i];
//       if (req.status === "fulfilled") {
//         successfulReq.push({ index: i, person: req.value as IPerson });
//       } else {
//         failedReq.push({ index: i, reason: req.reason });
//       }
//     }
//     if (successfulReq.length < noks.length) {
//       //TODO: Delete all successful
//       //find exact next
//       return new AppError("Error in creating next of kin profile", {
//         cause: {
//           code: 0,
//           label: "Next of Kin Profile Error!",
//         },
//       });
//     }
//     // const newPatient = await createPtWithPerson({
//     //   variables: {
//     //     oldId: oldId,
//     //     person_id: person_id,
//     //     next_of_kins: next_of_kins.map((n, i) => ({
//     //       relationship: n.relationship,
//     //       person_id: successfulReq[i].person._id,
//     //     })),
//     //   },
//     // });
//     return null;
//   } catch (err) {
//     if (err instanceof ApolloError) {
//       return new AppError<IPerson>((err as ApolloError).message, {
//         cause: { code: 1, label: "User Exists" },
//       });
//     }
//     return err as AppError<IPerson>;
//   }
// }
// type IActionCreatePatientProps = Pick<
//   IWithPatientProps,
//   "getPatients" | "getPersons" | "createPatient"
// > & {
//   info: INewPersonData<IFormPatient>;
// };
// export async function actionCreatePatient({
//   getPersons,
//   getPatients,
//   createPatient,
//   info,
// }: IActionCreatePatientProps): Promise<AppError<{
//   result?: IPerson;
//   info?: Pick<IActionCreatePatientMetaProps, "info">;
// }> | null> {
//   try {
//     const { profile, next_of_kins } = info;
//     const cNextOfKins = next_of_kins.map((nextOfKin) => {
//       return patientFormRefactor(actionRemoveNoks(nextOfKin as IFormNextOfKin));
//     });
//     const cProfile = patientFormRefactor(profile as IFormPatient);
//     const patient: QTransferPatient = {
//       oldId: cProfile.oldId,
//       profile: cProfile.profile,
//       next_of_kins: cNextOfKins.map((i) => ({
//         next_of_kin: i.profile,
//         relationship: i.relationship as string,
//       })),
//     };
//     const { data: ptWithSameNationalID } = await getPatients({
//       variables: {
//         keyword: {
//           person: {
//             profile: {
//               national_identity: patient.profile.national_identity,
//             },
//           },
//         },
//         // patien patient.profile.national_identity,
//       },
//     });
//     if (
//       ptWithSameNationalID?.patients &&
//       ptWithSameNationalID.patients.length > 0
//     ) {
//       throw new AppError(
//         `Patient with national ID ${patient.profile.national_identity} already exists`,
//         {
//           cause: {
//             code: 0,
//             label: "Patient Already Exists!",
//           },
//         }
//       );
//     }
//     const { data: ptWithSamePhoneNumber } = await getPatients({
//       variables: {
//         keyword: {
//           person: {
//             profile: {
//               phone_number: patient.profile.phone_number,
//             },
//           },
//         },
//       },
//     });
//     if (
//       ptWithSamePhoneNumber?.patients &&
//       ptWithSamePhoneNumber.patients.length > 0
//     ) {
//       throw new AppError(
//         `Patient with phone number ${patient.profile.phone_number} already exist`,
//         {
//           cause: {
//             code: 0,
//             label: "Patient Already Exists!",
//           },
//         }
//       );
//     }

//     // checking for person to convert to patient, but has the same phone number
//     const { data: dataPersons, error } = await getPersons({
//       variables: {
//         keyword: {
//           profile: {
//             phone_number: patient.profile.phone_number,
//           },
//         },
//         limit: 1,
//       },
//     });
//     const { persons: personsWithPhone } = dataPersons || {};
//     if (error || personsWithPhone?.[0]) {
//       throw new AppError(
//         error?.message ||
//           `Person with phone number ${patient.profile.phone_number} already exists`,
//         {
//           cause: {
//             code: error ? 0 : 1,
//             label: "Existing Phone Number",
//             data: { info, result: personsWithPhone?.[0] },
//           },
//         }
//       );
//     }
//     // no need searching person with national identity as this will be covered with find patient
//     // as next of kin person doesn't record the national identity
//     const nokPhone = patient.next_of_kins?.[0]?.next_of_kin.phone_number;
//     if (!nokPhone) {
//       throw new AppError(`Next of kin phone number missing`, {
//         cause: {
//           code: 0,
//           label: "Next of Kin Profile Error",
//         },
//       });
//     }

//     const { data: nokData, error: pError } = await getPersons({
//       variables: {
//         keyword: {
//           profile: {
//             phone_number: nokPhone,
//           },
//         },
//       },
//     });
//     const { persons: nokPerson } = nokData || {};
//     if (pError || nokPerson?.[0]) {
//       throw new AppError(
//         pError?.message ||
//           `Next of kin with phone number ${nokPhone}, do you want to use him/her instead?`,
//         {
//           cause: {
//             code: pError ? 0 : 2,
//             label: "Existing Next of kin",
//             data: { info, result: nokPerson?.[0] },
//           },
//         }
//       );
//     }
//     await createPatient({
//       variables: {
//         oldId: patient.oldId,
//         profile: patient.profile,
//         next_of_kins: patient.next_of_kins,
//       },
//     });
//     return null;
//   } catch (err) {
//     if (err instanceof ApolloError) {
//       return new AppError((err as ApolloError).message, {
//         cause: { code: 1, label: "User Exists" },
//       });
//     }
//     return err as AppError<{
//       result?: IPerson;
//       info: Pick<IActionCreatePatientMetaProps, "info">;
//     }>;
//   }
// }
