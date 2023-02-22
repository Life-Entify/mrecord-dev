import { Badge, Collapse } from "antd";
import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { INatives } from "ui/components/types";

const Root = styled.div`
  min-height: 200px;
`;
const Title = styled.h3``;
export interface IPatientFamilyProps<
  Nok,
  Person,
  InfoBoardKeys extends INatives
> {
  familyMembers?: {
    nextOfKins?: Nok[];
    members?: Person[];
  };
  infoBoardProps?: IInfoBoardProps<InfoBoardKeys>;
}
export function PatientFamily<Nok, Person, InfoBoardKeys extends INatives>({
  familyMembers,
  infoBoardProps,
}: IPatientFamilyProps<Nok, Person, InfoBoardKeys>) {
  const { nextOfKins, members } = familyMembers || {};
  return (
    <Root>
      {nextOfKins && (
        <>
          <Title>Next Of Kins</Title>
          <Collapse>
            {nextOfKins.map((nok: any, index) => {
              const { person, relationship } = nok;
              const profile = person?.["profile"];
              return (
                <Collapse.Panel
                  key={index}
                  header={profile?.last_name + " " + profile?.first_name}
                  extra={<Badge>{relationship}</Badge>}
                >
                  <InfoBoard<InfoBoardKeys>
                    data={profile}
                    {...infoBoardProps}
                  />
                </Collapse.Panel>
              );
            })}
          </Collapse>
        </>
      )}
    </Root>
  );
}
