import { Space, Button, INewPtNotificationProps } from "ui";
import { patientDataMapping } from "./data";
import React from "react";
import { IDisplayPatientRecord } from "./types";
import { QPatient } from "app/graph.queries/patients/types";
import { QProfile } from "app/graph.queries/persons/types";
export function foundNewPatientNotification({
  title,
  description,
  person,
  onClick,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  person: IDisplayPatientRecord;
  onClick?: React.MouseEventHandler;
}): INewPtNotificationProps<keyof (QPatient & QProfile)> {
  return {
    title,
    description,
    infoBoardProps: {
      title: person.last_name + " " + person.first_name,
      descriptionProps: {
        extra: (
          <Space>
            <Button onClick={onClick}>Edit Profile</Button>
            <Button type="primary">Use found profile</Button>
          </Space>
        ),
      },
      data: person,
      dataMap: patientDataMapping,
    },
  };
}
