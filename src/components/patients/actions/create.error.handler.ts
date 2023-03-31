import React from "react";
import { AppError } from "ui";
import { IFormPatient } from "ui/components/Patients/types";
import { INewPersonData, IPerson } from "ui/components/Person";
import { IExistingPersonState, INotify } from ".";

export function createErrorHandler(
  info: INewPersonData<IFormPatient>,
  error: AppError<IPerson>,
  {
    setExistingPerson,
    notify,
    onClose,
    onViewExistingPerson,
  }: {
    setExistingPerson: React.Dispatch<IExistingPersonState>;
    notify: INotify;
    onClose?: () => void;
    onViewExistingPerson?: () => void;
  }
) {
  if (error.cause?.code === 0)
    notify("error", {
      key: "create-pt-error",
      message: "Create Patient Error",
      description: error.message,
    });
  else if (error.cause?.code === 1) {
    const { data: person } = error?.cause || {};
    const { last_name, phone_number } = error.cause?.data?.profile || {};
    setExistingPerson({ person: person as IPerson, who: "patient" });
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
        {
          children: "View Profile",
          type: "primary",
          onClick: onViewExistingPerson,
        },
      ],
    });
  }
}
