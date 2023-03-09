import React from "react";
import { IFormPatient } from "../Patients/types";
import {
  IAddress,
  IFormNextOfKin,
  IFormPerson,
  IPerson,
  IProfile,
} from "./types";

export function fullAddress(address: IAddress) {
  let buildString = "";
  if (address.street) buildString += address.street + ", ";
  if (address.town) buildString += address.town + ", ";
  if (address.lga) buildString += address.lga + ", ";
  if (address.nstate) buildString += address.nstate + ", ";
  if (address.country) buildString += address.country;
  return buildString;
}
export function spreadPersonData(person?: IPerson, showId: boolean = true) {
  if (!person) return undefined;
  const data = {
    ...person?.profile,
    addresses:
      person?.profile?.addresses?.[0] &&
      fullAddress(person.profile.addresses?.[0]),
  };
  return (showId ? { patient_id: person.person_id, ...data } : data) as Record<
    keyof (IPerson & IProfile),
    React.ReactNode
  >;
}

export interface IFormNextOfKinData
  extends Partial<Omit<IFormPerson, "old_id">> {
  relationship?: string;
}
export const actionRemoveNoks = (values: IFormNextOfKin) => {
  const newValue: IFormNextOfKinData = {};
  for (const name in values) {
    if (Object.prototype.hasOwnProperty.call(values, name)) {
      newValue[
        (name.includes("nok_")
          ? name.replace("nok_", "")
          : name) as keyof IFormNextOfKinData
      ] = values[name as keyof IFormNextOfKin];
    }
  }
  return newValue;
};

export const actionRefactorProfile = (
  target: IFormNextOfKinData | IFormPatient
): {
  oldId?: string | null;
  profile: Partial<IProfile>;
  relationship?: string | null;
} => {
  let oldId;
  let relationship;

  if (target.phone_number?.includes("+")) {
    target.phone_number = target.phone_number.replaceAll("+", "");
  }
  if ((target as IFormPatient).old_id) {
    oldId = (target as IFormPatient).old_id;
    delete (target as IFormPatient).old_id;
  }
  if ((target as IFormNextOfKinData).relationship) {
    relationship = (target as IFormNextOfKinData).relationship;
    delete (target as IFormNextOfKinData).relationship;
  }
  const address: Partial<IAddress> = {};
  const addressKeys: (keyof IAddress)[] = [
    "street",
    "town",
    "lga",
    "nstate",
    "country",
  ];
  for (let i = 0; i < addressKeys.length; i++) {
    const addKey = addressKeys[i];
    if (target[addKey]) {
      address[addKey] = target[addKey];
      delete target[addKey];
    }
  }
  address._id = "address1";
  return {
    oldId,
    profile: { ...target, addresses: [address as IAddress] },
    relationship,
  };
};
