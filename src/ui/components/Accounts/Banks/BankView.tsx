import { Button, Divider, Table, TableProps } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard, IToolbarProps, Toolbar } from "ui/common";
import { IBank, IBankTx } from "../types";
import { bankLabelMap } from "./data";

const Root = styled.div``;

export interface IBankViewProps {
  bank?: IBank;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof IBank>,
    "data" | "dataMap" | "skipMap"
  >;
  toolbarProps?: IToolbarProps;
  tableProps?: TableProps<IBankTx>;
}
interface IBankViewState {
  showDetail: boolean;
}
export function BankView({
  bank,
  infoBoardProps,
  toolbarProps,
  tableProps,
}: IBankViewProps) {
  const [state, _setState] = useState<Partial<IBankViewState>>({});
  const setState = (_state: Partial<IBankViewState>) =>
    _setState((state) => ({ ...state, ..._state }));
  return (
    <Root>
      <Button
        size="small"
        style={{ marginBottom: 20 }}
        onClick={() => setState({ showDetail: !state.showDetail })}
      >
        {state.showDetail ? "Hide " : "Show "} Details
      </Button>
      {state.showDetail && (
        <>
          <InfoBoard<keyof IBank>
            {...infoBoardProps}
            title={bank?.bank}
            data={bank}
            dataMap={bankLabelMap}
            skipMap={["_id"]}
          />
          <Divider style={{ marginTop: 50, marginBottom: 20 }} />
        </>
      )}
      <Toolbar {...toolbarProps} />
      <Table {...tableProps} />
    </Root>
  );
}
