import { FormInstance, FormProps, List } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import {
  IBank,
  ICheque,
  IPaymentCategory,
  IPaymentForm,
  ITx,
  TxType,
} from "../types";
import { paymentForm } from "./data";

const Root = styled.div``;

export interface INewPaymentProps {
  openClient?: (form: React.RefObject<FormInstance<IPaymentForm>>) => void;
  openPaymentCategory?: (
    form: React.RefObject<FormInstance<IPaymentForm>>,
    txType: TxType
  ) => void;
  clientName?: string;
  formProps?: FormProps;
  cheques?: ICheque[];
  banks?: IBank[];
  transactions?: ITx[];
  categories?: IPaymentCategory[];
  isEdit?: boolean;
  resetTxs?: () => void;
}

export function NewPayment({
  transactions,
  categories,
  openClient,
  openPaymentCategory,
  formProps,
  cheques,
  banks,
  clientName,
  isEdit,
  resetTxs,
}: INewPaymentProps) {
  const formRef = React.useRef<FormInstance<IPaymentForm>>(null);
  return (
    <Root>
      {transactions && transactions.length > 0 && (
        <div>
          <List<ITx>
            style={{ margin: "0px 55px" }}
            size="small"
            header={<strong>Transactions</strong>}
            footer={
              <List.Item
                actions={[
                  <strong>
                    {Number(
                      transactions
                        ?.map((i) => Number(i.amount || 0))
                        .reduce((a, b) => a + b)
                    ).toLocaleString()}
                  </strong>,
                ]}
              >
                <List.Item.Meta title="Total" />
              </List.Item>
            }
            dataSource={transactions}
            renderItem={(item, index) => {
              const category = categories?.find(
                (i) => i._id === item.category_id
              );
              return (
                <List.Item
                  key={index}
                  actions={[Number(item.amount).toLocaleString()]}
                >
                  <List.Item.Meta title={category?.title} />
                </List.Item>
              );
            }}
          />
        </div>
      )}
      <Form
        formRef={formRef}
        formProps={{
          name: "payment-new-form",
          layout: "horizontal",
          labelCol: { span: 8 },
          wrapperCol: { span: 14 },
          ...formProps,
        }}
        items={[
          ...paymentForm({
            openClient() {
              openClient?.(formRef);
            },
            openCategory(txType) {
              openPaymentCategory?.(formRef, txType);
            },
            cheques,
            banks,
            clientName,
            resetTxs,
            isEdit,
          }),
          {
            fieldType: FORM_FIELD_TYPES.FIELDS,
            itemProps: {
              wrapperCol: { span: 14, offset: 10 },
            },
            fieldProps: [
              {
                fieldType: FORM_FIELD_TYPES.BUTTON,
                fieldProps: {
                  type: "primary",
                  htmlType: "submit",
                  children: `${isEdit ? "Update" : "Create"} Payment`,
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
