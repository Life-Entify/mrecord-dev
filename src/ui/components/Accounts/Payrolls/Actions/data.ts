import React from "react";
import { FORM_FIELD_TYPES, IFormItems } from "ui/common";
import { IBank, PAYROLL_ACTION_KINDS, PAYROLL_ACTION_TYPES } from "../../types";

export const getPayrollActionForm = (
  openStaff?: React.MouseEventHandler
): IFormItems[] => [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "name",
      label: "Name",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Description",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "action_type",
      label: "Action Type",
    },
    fieldProps: {
      options: [
        { value: PAYROLL_ACTION_TYPES.bonus, label: "Bonus" },
        { value: PAYROLL_ACTION_TYPES.deduction, label: "Deduction" },
      ],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "action_kind",
      label: "Action Kind",
    },
    fieldProps: {
      options: [
        { value: PAYROLL_ACTION_KINDS.percent, label: "Percent" },
        { value: PAYROLL_ACTION_KINDS.value, label: "Value" },
      ],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "amount",
      label: "Amount/Percent",
    },
    fieldProps: {
      type: "number",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SWITCH,
    itemProps: {
      name: "is_general",
      label: "General",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return prevValues.is_general !== currentValues.is_general;
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      return !formInstance?.getFieldValue?.("is_general")
        ? fieldData && fieldForm?.(fieldData)
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.FIELDS,
      itemProps: {
        name: "use_staff",
        label: "Staff",
      },
      fieldProps: [
        {
          fieldProps: {
            children: "Select Staff",
            onClick: openStaff,
          },
          fieldType: FORM_FIELD_TYPES.BUTTON,
        },
      ],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SWITCH,
    itemProps: {
      name: "is_constant",
      label: "Repeat Action Constantly",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return prevValues.is_constant !== currentValues.is_constant;
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      return !formInstance?.getFieldValue?.("is_constant")
        ? fieldData && fieldForm?.(fieldData)
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.TEXT,
      itemProps: {
        name: "repeat_duration",
        label: "Repeat Duration",
      },
      fieldProps: {
        type: "number",
      },
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Other description of account",
    },
    fieldProps: {
      maxLength: 100,
      showCount: true,
    },
  },
];
