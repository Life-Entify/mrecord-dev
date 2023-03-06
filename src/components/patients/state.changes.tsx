import { Space, Button, INewPtNotificationProps } from "ui";
import React from "react";
import { IPerson } from "ui/components/Person";
export function foundNewPatientNotification({
  title,
  description,
  person,
  onClick,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  person: IPerson;
  onClick?: React.MouseEventHandler;
}): INewPtNotificationProps {
  return {
    title,
    description,
    person,
    infoBoardProps: {
      descriptionProps: {
        extra: (
          <Space>
            <Button onClick={onClick}>Edit Profile</Button>
            <Button type="primary">Use found profile</Button>
          </Space>
        ),
      },
    },
  };
}
