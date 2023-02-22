import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";

const Root = styled.div``;
const Title = styled.h2``;
const Description = styled.div``;


export interface INewPtNotificationProps<T extends string | number | symbol> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  infoBoardProps?: IInfoBoardProps<T>;
}
export function NewPtNotification<T extends string | number | symbol>({
  title, description, infoBoardProps
}:INewPtNotificationProps<T>){
  return <Root>
    <Title>{title}</Title>
    <Description>
      {description}
    </Description>
    <InfoBoard<T> {...infoBoardProps}/>
  </Root>
}