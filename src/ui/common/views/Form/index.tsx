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
  Switch,
  SwitchProps,
  TreeSelect,
  TreeSelectProps,
} from "antd";
import type { FormInstance, FormItemProps, FormProps } from "antd/es/form";
import { TextAreaProps } from "antd/es/input";

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
  DATE = 7,
  TEXT_AREA = 8,
  SWITCH = 9,
  TREE_SELECT = 10,
  HIDDEN = 11,
}
type BtnProps = ButtonProps;
type IFieldProps =
  | InputProps
  | TextAreaProps
  | DatePickerProps
  | SelectField
  | BtnProps
  | SwitchProps
  | TreeSelectProps;
export interface IFieldsProps {
  fieldProps: IFieldProps;
  fieldType: FORM_FIELD_TYPES;
}
export interface IFormItems {
  itemProps: FormItemProps;
  fieldProps?: IFieldProps | IFieldsProps[] | IFormItems;
  itemFunc?: (
    props?: Partial<FormInstance>,
    fieldForm?: React.FC<IFormItems>,
    fieldData?: IFormItems
  ) => React.ReactNode | null;
  fieldType: FORM_FIELD_TYPES;
}
export const FormFields: React.FC<IFormItems> = ({
  fieldType,
  fieldProps,
  itemProps,
  itemFunc,
}) => {
  switch (fieldType) {
    case FORM_FIELD_TYPES.HIDDEN:
      return (
        <AntForm.Item noStyle {...itemProps}>
          {(props) => {
            return itemFunc?.(props, FormFields, fieldProps as IFormItems);
          }}
        </AntForm.Item>
      );
    case FORM_FIELD_TYPES.TEXT_AREA:
      return (
        <AntForm.Item {...itemProps}>
          <Input.TextArea {...(fieldProps as TextAreaProps)} />
        </AntForm.Item>
      );
    case FORM_FIELD_TYPES.TEXT:
      return (
        <AntForm.Item {...itemProps}>
          <Input {...(fieldProps as InputProps)} />
        </AntForm.Item>
      );
    case FORM_FIELD_TYPES.TREE_SELECT:
      return (
        <AntForm.Item {...itemProps}>
          <TreeSelect {...(fieldProps as TreeSelectProps)} />
        </AntForm.Item>
      );
    case FORM_FIELD_TYPES.SWITCH:
      return (
        <AntForm.Item {...itemProps}>
          <Switch {...(fieldProps as SwitchProps)} />
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
  getForm?: (form: FormInstance) => void;
}

export const Form: React.FC<IFormProps> = ({
  formProps,
  formRef,
  items,
  getForm,
}) => {
  const [form] = AntForm.useForm();
  if (getForm) {
    getForm(form);
  }

  return (
    <AntForm ref={formRef} style={{ maxWidth: 600 }} {...formProps} form={form}>
      {items?.map((item, index) => {
        return <FormFields key={index} {...item} />;
      })}
    </AntForm>
  );
};
