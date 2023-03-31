import { Button, Table, TableProps } from "antd";
import React, { useMemo } from "react";
import styled from "styled-components";
import { IEmployee } from "ui/components/Employees/Employee";
import { IPayroll, IPaySlip } from "../types";
import { getPaySlipTableColumns } from "./data";

const Root = styled.div``;
const Title = styled.h3``;
const Description = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export interface IViewPayrollProps {
  payroll?: IPayroll;
  staffs?: IEmployee[];
  paySlipTableProps?: Omit<TableProps<IPaySlip>, "columns" | "dataSource"> & {
    removeColumns?: (keyof IPaySlip)[];
  };
  onShowSlip?: (dataIndex: string, record: IPaySlip) => void;
}

function ViewPayrollFunc({
  payroll,
  paySlipTableProps,
  staffs,
  onShowSlip,
}: IViewPayrollProps) {
  const { removeColumns, ...deepPaySlipTableProps } = paySlipTableProps || {};
  const { pay_slips: paySlips, name, description } = payroll || {};
  const newPaySlip = useMemo(() => {
    if (paySlips) {
      for (let i = 0; i < paySlips.length; i++) {
        const slip = paySlips[i];
        if (staffs) {
          const staff = staffs.find(
            (staff) => staff.employee_id === slip.employee_id
          );
          paySlips[i].staff = staff;
        }
      }
    }
    return paySlips;
  }, [JSON.stringify(paySlips), JSON.stringify(staffs)]);
  return (
    <Root>
      <Title>{name}</Title>
      <Description>{description}</Description>
      <Container>
        <Table
          {...deepPaySlipTableProps}
          columns={getPaySlipTableColumns(
            removeColumns,
            (dataIndex) => (value, record) => {
              if (dataIndex === "slip") {
                return (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => onShowSlip?.(dataIndex, record)}
                  >
                    View Slip
                  </Button>
                );
              }
              return value;
            }
          )}
          dataSource={newPaySlip}
          size="small"
        />
      </Container>
    </Root>
  );
}

export const ViewPayroll = React.memo(ViewPayrollFunc);
