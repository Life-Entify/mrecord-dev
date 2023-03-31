import { Button, Space } from "antd";
import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { IPerson, IProfile } from "./types";
import { spreadPersonData } from "./common";
import { personDataMapping } from "./data";

const Root = styled.div``;
const Title = styled.h2``;
const Description = styled.div``;

export interface IExistingPersonDisplayProps {
  person?: IPerson;
  description?: React.ReactNode;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof (IPerson & IProfile)>,
    "data" | "dataMap"
  >;
  onEditProfile?: (person?: IPerson) => void;
  onUsePerson?: (person?: IPerson) => void;
}
export function ExistingPersonDisplay({
  description,
  infoBoardProps,
  person,
  onEditProfile,
  onUsePerson,
}: IExistingPersonDisplayProps) {
  const { last_name, first_name } = person?.profile || {};
  return (
    <Root>
      <Title>{last_name + " " + first_name}</Title>
      <Description>{description}</Description>
      <InfoBoard
        {...infoBoardProps}
        data={spreadPersonData(person)}
        dataMap={personDataMapping}
        descriptionProps={{
          extra: (
            <Space>
              {onEditProfile && (
                <Button
                  onClick={() => {
                    onEditProfile?.(person);
                  }}
                >
                  Edit Profile
                </Button>
              )}
              {onUsePerson && (
                <Button type="primary" onClick={() => onUsePerson?.(person)}>
                  Use found profile
                </Button>
              )}
            </Space>
          ),
        }}
      />
    </Root>
  );
}
