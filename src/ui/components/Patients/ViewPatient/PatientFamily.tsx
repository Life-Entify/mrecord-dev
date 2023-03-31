import { Badge, Collapse } from "antd";
import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import {
  IAddress,
  IFamilyMemberDetails,
  INextOfKinDetails,
  IPerson,
  IProfile,
} from "ui/components/Person";
import { fullAddress, spreadPersonData } from "ui/components/Person/common";
import { personDataMapping } from "ui/components/Person/data";

const Root = styled.div`
  min-height: 200px;
`;
const Title = styled.h3``;
export interface IPatientFamilyProps {
  familyMembers?: {
    nextOfKins?: INextOfKinDetails[];
    members?: IFamilyMemberDetails[];
  };
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof (IPerson & IProfile)>,
    "dataMap" | "skipMap"
  >;
}
export function PatientFamily({
  familyMembers,
  infoBoardProps,
}: IPatientFamilyProps) {
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
                  <InfoBoard
                    data={spreadPersonData(person)}
                    {...infoBoardProps}
                    replaceMap={(value, key, data) => {
                      if (key === "addresses") {
                        return fullAddress((value as IAddress[])?.[0]);
                      }
                      return value;
                    }}
                    dataMap={personDataMapping}
                    skipMap={[
                      "addresses",
                      "next_of_kins",
                      "next_of_kins_details",
                    ]}
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
