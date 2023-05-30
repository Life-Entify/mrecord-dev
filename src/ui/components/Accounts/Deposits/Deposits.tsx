import { Tabs, TabsProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common";
import { DepositHistory, DepositHistoryProps } from "./History";

const Root = styled.div``;
const Container = styled.div``;

export interface IDepositProps {
  tabsProps?: TabsProps;
  toolbarProps?: IToolbarProps;
  depositHxProps?: DepositHistoryProps
}

export function Deposits({ tabsProps, toolbarProps }: IDepositProps) {
  return (
    <Root>
      {toolbarProps && <Toolbar {...toolbarProps} />}
      <Container>
        <Tabs
          {...tabsProps}
          items={[
            {
              label: "Deposits",
              tabKey: "deposits",
              key: "deposits",
              children: <DepositHistory />,
            },
            {
              label: "Depositors",
              tabKey: "depositors",
              key: "depositors",
              children: <></>,
            },
          ]}
          
        />
      </Container>
    </Root>
  );
}
