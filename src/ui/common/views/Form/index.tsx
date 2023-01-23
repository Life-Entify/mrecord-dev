import React from "react";
import {
  Button,
  ButtonProps,
  DatePicker,
  DatePickerProps,
  Form as AntForm,
  Input,
  InputProps,
  Select,
  SelectProps,
} from "antd";
import type { FormInstance, FormItemProps, FormProps } from "antd/es/form";

const { Option } = Select;

type SelectField = {
  field: SelectProps;
  options: { value: string; label: string }[];
};
export enum FORM_FIELD_TYPES {
  TEXT = 1,
  RADIO = 2,
  CHECK = 3,
  SELECT = 4,
  FIELDS = 5,
  BUTTON = 6,
  DATE = 7
}
type BtnProps = ButtonProps;
type IFieldProps = InputProps | DatePickerProps | SelectField | BtnProps;
type IFieldsProps = {
  fieldProps: IFieldProps;
  fieldType: FORM_FIELD_TYPES;
};
export interface IFormItems {
  itemProps?: FormItemProps;
  fieldProps?: IFieldProps | IFieldsProps[];
  fieldType: FORM_FIELD_TYPES;
}
export const FormFields: React.FC<IFormItems> = ({
  fieldType,
  fieldProps,
  itemProps,
}) => {
  switch (fieldType) {
    case FORM_FIELD_TYPES.TEXT:
      return (
        <AntForm.Item {...itemProps}>
          <Input {...(fieldProps as InputProps)} />
        </AntForm.Item>
      );
    case FORM_FIELD_TYPES.DATE:
      return (
        <AntForm.Item {...itemProps}>
          <DatePicker {...(fieldProps as DatePickerProps)} />
        </AntForm.Item>
      );
    case FORM_FIELD_TYPES.BUTTON:
      return (
        <Button {...(fieldProps as BtnProps)}>
          {(fieldProps as BtnProps).children}
        </Button>
      );
    case FORM_FIELD_TYPES.SELECT:
      return (
        <AntForm.Item {...itemProps}>
          <Select allowClear {...(fieldProps as SelectField).field}>
            {(fieldProps as SelectField)?.options.map((option, optionIndex) => {
              return (
                <Option
                  key={`selectoption--${optionIndex}`}
                  value={option.value}
                >
                  {option.label}
                </Option>
              );
            })}
          </Select>
        </AntForm.Item>
      );
    case FORM_FIELD_TYPES.FIELDS:
      return (
        <AntForm.Item {...itemProps}>
          {(fieldProps as IFieldsProps[]).map((field, index) => {
            return (
              <FormFields
                key={index}
                fieldType={field.fieldType}
                fieldProps={field.fieldProps}
                itemProps={itemProps}
              />
            );
          })}
        </AntForm.Item>
      );
  }
  return null;
};
export interface IFormProps {
  formRef: React.Ref<FormInstance<any>>;
  formProps?: FormProps;
  items?: IFormItems[];
}
export const Form: React.FC<IFormProps> = ({ formProps, formRef, items }) => {
  const [form] = AntForm.useForm();
  return (
    <AntForm ref={formRef} style={{ maxWidth: 600 }} {...formProps} form={form}>
      {items?.map((item, index) => {
        return (
          <FormFields
            key={index}
            itemProps={item.itemProps}
            fieldProps={item.fieldProps}
            fieldType={item.fieldType}
          />
        );
      })}
    </AntForm>
  );
};
