import { Button, Divider } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { ArrowDownOutlined, CloseOutlined, InfoBoard } from "ui/common";
import { bankLabelMap, IBank } from "ui/components/Accounts";
import {
  IPaymentTableProps,
  PaymentTable,
} from "ui/components/Accounts/Tables";
import { IEmployee } from "../../types";

const Root = styled.div``;

export interface IStaffAccountProps {
  employee?: IEmployee;
  showNewBankForm?: React.MouseEventHandler;
  paymentTableProps?: Omit<IPaymentTableProps, "showTx">;
}

export function StaffAccount({
  employee,
  showNewBankForm,
  paymentTableProps,
}: IStaffAccountProps) {
  const [openDetails, setDetails] = useState<boolean>();
  return (
    <Root>
      {!employee?.person?.bank ? (
        <Button onClick={showNewBankForm}>Create Bank Account</Button>
      ) : (
        <InfoBoard<keyof IBank>
          data={employee?.person?.bank}
          title="Bank Details"
          dataMap={bankLabelMap}
          skipMap={["_id"]}
          descriptionProps={{
            size: "small",
            style: openDetails
              ? {}
              : {
                  height: 20,
                  overflow: "hidden",
                },
            extra: openDetails ? (
              <CloseOutlined onClick={() => setDetails(!openDetails)} />
            ) : (
              <ArrowDownOutlined onClick={() => setDetails(!openDetails)} />
            ),
          }}
        />
      )}
      <Divider style={{ margin: "20px 0px" }} />
      <PaymentTable {...paymentTableProps} showTx={false} />
    </Root>
  );
}
