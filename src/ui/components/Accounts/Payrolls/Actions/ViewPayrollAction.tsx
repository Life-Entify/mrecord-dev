import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { IPayrollAction } from "../../types";
import { payrollActionDataMap } from "./data";

const Root = styled.div``;

export interface IViewPayrollActionProps {
  payrollAction?: IPayrollAction;
  infobaordProps?: Omit<
    IInfoBoardProps<keyof IPayrollAction>,
    "data" | "dataMap"
  >;
}

export function ViewPayrollAction({
  payrollAction,
  infobaordProps,
}: IViewPayrollActionProps) {
  return (
    <Root>
      <InfoBoard
        data={payrollAction as Required<IPayrollAction>}
        dataMap={payrollActionDataMap}
        replaceMap={(value, key) => {
          if (key === "active") {
            return value ? "Active" : "Inactive";
          } else if (value === true) return "Yes";
          else if (value === false) return "No";
          else return value;
        }}
        {...infobaordProps}
      />
    </Root>
  );
}
