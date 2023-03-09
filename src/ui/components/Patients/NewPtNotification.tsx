import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { IPerson, IProfile } from "../Person";
import { spreadPersonData } from "../Person/common";
import { personDataMapping } from "../Person/data";

const Root = styled.div``;
const Title = styled.h2``;
const Description = styled.div``;

export interface INewPtNotificationProps {
  person?: IPerson;
  title?: React.ReactNode;
  description?: React.ReactNode;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof (IPerson & IProfile)>,
    "data" | "dataMap"
  >;
}
export function NewPtNotification({
  description,
  infoBoardProps,
  person,
}: INewPtNotificationProps) {
  const { last_name, first_name } = person?.profile || {};
  return (
    <Root>
      <Title>{last_name + " " + first_name}</Title>
      <Description>{description}</Description>
      <InfoBoard
        {...infoBoardProps}
        data={spreadPersonData(person)}
        dataMap={personDataMapping}
      />
    </Root>
  );
}
