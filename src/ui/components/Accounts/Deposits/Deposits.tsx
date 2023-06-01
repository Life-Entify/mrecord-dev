import { Tabs, TabsProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common";
import { DepositHistory, DepositHistoryProps } from "./History";
import { DepositorProps, Depositors } from "./Depositors";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export interface IDepositProps {
  tabsProps?: TabsProps;
  toolbarProps?: IToolbarProps;
  depositHxProps?: DepositHistoryProps;
  depositorProps?: DepositorProps;
}

export function Deposits({
  tabsProps,
  toolbarProps,
  depositHxProps,
  depositorProps,
}: IDepositProps) {
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
              children: <DepositHistory {...depositHxProps} />,
            },
            {
              label: "Depositors",
              tabKey: "depositors",
              key: "depositors",
              children: <Depositors {...depositorProps} />,
            },
          ]}
        />
      </Container>
    </Root>
  );
}
