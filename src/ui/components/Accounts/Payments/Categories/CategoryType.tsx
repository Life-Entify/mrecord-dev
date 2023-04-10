import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { List, ListProps, FormInstance } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES, IFormItems } from "ui/common";
import { categoryFormInputs } from "./data";
import { IPaymentCategory, LIST_ACTIONS, TxType } from "../../types";

const Root = styled.div``;
const FormTitle = styled.h3`
  text-align: center;
`;
export interface ICategoryTypeProps<List = IPaymentCategory> {
  type: TxType;
  listProps?: ListProps<List> & {
    onActionClick?: (
      action: LIST_ACTIONS,
      item: List,
      options?: {
        callback?: () => void;
        prevItem?: IPaymentCategory;
      }
    ) => void;
    onCreateItem?: (item: List, options?: { callback?: () => void }) => void;
  };
}
export function CategoryType({ listProps, type }: ICategoryTypeProps) {
  const { onActionClick, onCreateItem, ...deepListProps } = listProps || {};
  const [isEdit, setEdit] = useState<boolean>();
  const [payCat, setPayCat] = useState<IPaymentCategory>();
  const formRef = React.useRef<FormInstance<IPaymentCategory>>(null);
  const [formChanges, setFormChanges] = useState<Partial<ICategoryTypeProps>>();
  let incomeCatForm: FormInstance<IPaymentCategory>;
  return (
    <Root>
      <List
        style={{
          borderRadius: 6,
          padding: 20,
        }}
        bordered
        {...deepListProps}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            actions={[
              <EditOutlined
                onClick={() => {
                  incomeCatForm?.setFieldsValue(item);
                  setEdit(true);
                  setPayCat(item);
                }}
              />,
              <DeleteOutlined
                onClick={() => onActionClick?.(LIST_ACTIONS.DELETE, item)}
              />,
            ]}
          >
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
        header={
          <List.Item>
            <div style={{ width: "100%" }}>
              <FormTitle>
                New {type === TxType.income ? "Income" : "Expenditure"} Category
              </FormTitle>
              <Form
                formRef={formRef}
                formProps={{
                  style: { width: "100%" },
                  name: "income-new-form",
                  layout: "vertical",
                  onValuesChange(changedValues) {
                    if (isEdit)
                      setFormChanges((state) => ({
                        ...state,
                        ...changedValues,
                      }));
                  },
                  onFinish(values) {
                    isEdit
                      ? onActionClick?.(
                          LIST_ACTIONS.EDIT,
                          formChanges as IPaymentCategory,
                          {
                            callback() {
                              setEdit(false);
                              setFormChanges({});
                              formRef.current?.resetFields();
                            },
                            prevItem: payCat,
                          }
                        )
                      : onCreateItem?.(values, {
                          callback() {
                            formRef.current?.resetFields();
                          },
                        });
                  },
                }}
                getForm={(form) => (incomeCatForm = form)}
                items={[
                  ...categoryFormInputs,
                  ...(isEdit
                    ? ([
                        {
                          fieldType: FORM_FIELD_TYPES.FIELDS,
                          itemProps: {
                            wrapperCol: { span: 14, offset: 10 },
                            style: {},
                          },
                          fieldProps: [
                            {
                              fieldType: FORM_FIELD_TYPES.BUTTON,
                              fieldProps: {
                                name: "cancel",
                                children: "Cancel",
                                style: { marginRight: 10 },
                                onClick: () => {
                                  formRef.current?.resetFields();
                                  setEdit(false);
                                },
                              },
                            },
                            {
                              fieldType: FORM_FIELD_TYPES.BUTTON,
                              fieldProps: {
                                type: "primary",
                                htmlType: "submit",
                                children: "Update Category",
                              },
                            },
                          ],
                        },
                      ] as IFormItems[])
                    : ([
                        {
                          fieldType: FORM_FIELD_TYPES.BUTTON,
                          itemProps: {
                            wrapperCol: { span: 14, offset: 10 },
                          },
                          fieldProps: {
                            type: "primary",
                            htmlType: "submit",
                            children: "Create Category",
                          },
                        },
                      ] as IFormItems[])),
                ]}
              />
            </div>
          </List.Item>
        }
      />
    </Root>
  );
}
