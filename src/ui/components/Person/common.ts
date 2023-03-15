import moment from "moment";
import React from "react";
import { IFormPatient } from "../Patients/types";
import {
  IAddress,
  IFormNextOfKin,
  IFormNextOfKinData,
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

export const actionAddNoks = (values: IFormNextOfKinData) => {
  const newValue: Partial<IFormNextOfKin> = {};
  for (const name in values) {
    if (Object.prototype.hasOwnProperty.call(values, name)) {
      newValue[`nok_${name}` as keyof IFormNextOfKin] =
        values[name as keyof IFormNextOfKinData];
    }
  }
  return newValue;
};
export const actionRemoveNoks = (values: IFormNextOfKin) => {
  const newValue: Partial<IFormPerson> = {};
  for (const name in values) {
    if (Object.prototype.hasOwnProperty.call(values, name)) {
      newValue[
        (name.includes("nok_")
          ? name.replace("nok_", "")
          : name) as keyof IFormPerson
      ] = values[name as keyof IFormNextOfKin];
    }
  }
  return newValue;
};

export function formToPerson(addressId: string, target: IFormPerson): IProfile {
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
  const profile: Partial<IProfile> = { ...target };
  if (Object.keys(address).length > 0) {
    address._id = addressId || "address1";
    profile.addresses = [address as IAddress];
  }
  if (profile.phone_number?.includes("+")) {
    profile.phone_number = profile.phone_number.replaceAll("+", "");
  }
  if (profile.dob) {
    profile.dob = moment(profile.dob).format("DD/MM/YYYY");
  }
  return profile as IProfile;
}
