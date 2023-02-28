import { Button } from "antd";
import React from "react";
import styled from "styled-components";
import { IOrganization } from "ui/components/Settings";
import { IPayment } from "../types";
const Root = styled.div`
  display: flex;
  font-weight: 600;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  line-height: 2;
`;
const Title = styled.div`
  font-size: 18px;
`;
const Address = styled.div``;
const Phones = styled.div``;
const Container = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
`;
export interface IPaymentReceiptProps {
  org?: IOrganization;
  payment?: IPayment;
}
export function PaymentReceipt({ org }: IPaymentReceiptProps) {
  return (
    <Root>
      <Title>{org?.name}</Title>
      <Address>{org?.address}</Address>
      <Phones>{org?.phones.join(", ")}</Phones>
      <Container>
        <div>
          <strong style={{ marginRight: 10 }}>Client:</strong> chijioke Agu
        </div>
        <Button style={{ marginTop: 50 }} type="primary">
          Print Receipt
        </Button>
      </Container>
    </Root>
  );
}
