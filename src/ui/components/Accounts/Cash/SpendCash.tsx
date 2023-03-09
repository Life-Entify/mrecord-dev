import { Button, FormInstance, Tooltip } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { ICashBundle, IPaymentCategory } from "../types";
import { getSpendCashForm } from "./data";

const Root = styled.div``;

export interface ISpendCashProps {
  bundle?: ICashBundle;
  categories?: IPaymentCategory[];
  onCreateItem?: React.MouseEventHandler;
}

function SpendCashFn({ bundle, categories, onCreateItem }: ISpendCashProps) {
  const formRef = React.useRef<FormInstance>(null);
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          name: "income-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          initialValues: {
            amount: bundle?.total_amount,
          },
          onFinish: onCreateItem,
        }}
        items={[
          ...getSpendCashForm(
            categories,
            <Tooltip>
              <Button
                type="ghost"
                onClick={() => {
                  formRef.current?.setFieldValue(
                    "amount",
                    (bundle?.total_amount || 0) - (bundle?.cashout_amount || 0)
                  );
                }}
              >
                All
              </Button>
            </Tooltip>
          ),
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
                  children: "Spend Cash",
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
export const SpendCash = React.memo(SpendCashFn);
