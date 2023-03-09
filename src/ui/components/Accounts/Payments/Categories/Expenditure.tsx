import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { List, ListProps, FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { categoryFormInputs } from "./data";
import { IPaymentCategory, LIST_ACTIONS } from "../../types";

const Root = styled.div``;
const FormTitle = styled.h3`
  text-align: center;
`;
export interface IExpenditureCategoryProps<List = IPaymentCategory> {
  listProps?: ListProps<List> & {
    onActionClick?: (type: LIST_ACTIONS, item: List) => void;
    onCreateItem?: React.MouseEventHandler<HTMLDivElement>;
  };
}
export function ExpenditureCategory({ listProps }: IExpenditureCategoryProps) {
  const { onActionClick, onCreateItem, ...deepListProps } = listProps || {};
  const formRef = React.useRef<FormInstance>(null);
  return (
    <Root>
      <List
        style={{
          borderRadius: 6,
          padding: 20,
        }}
        bordered
        {...deepListProps}
        renderItem={(item) => (
          <List.Item
            actions={[
              <EditOutlined
                onClick={() => onActionClick?.(LIST_ACTIONS.EDIT, item)}
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
              <FormTitle>New Expenditure Category</FormTitle>
              <Form
                formRef={formRef}
                formProps={{
                  style: { width: "100%" },
                  name: "income-new-form",
                  layout: "vertical",
                  initialValues: deepListProps?.dataSource?.[0],
                  onFinish: onCreateItem
                }}
                items={[
                  ...categoryFormInputs,
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
                ]}
              />
            </div>
          </List.Item>
        }
      />
    </Root>
  );
}
