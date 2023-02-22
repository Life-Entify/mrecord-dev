import { QPatient } from "app/graph.queries/patients/types";
import { QAddress } from "app/graph.queries/persons/types";

export function fullAddress(address: QAddress) {
  let buildString = "";
  if (address.street) buildString += address.street + ", ";
  if (address.town) buildString += address.town + ", ";
  if (address.lga) buildString += address.lga + ", ";
  if (address.nstate) buildString += address.nstate + ", ";
  if (address.country) buildString += address.country;
  return buildString;
}

export function spreadPatientData(data?: QPatient) {
  if (!data) return undefined;
  return {
    patient_id: data.patient_id,
    ...data.person.profile,
    addresses:
      data.person?.profile?.addresses?.[0] &&
      fullAddress(data.person.profile.addresses?.[0]),
  };
}
