import {
  Button,
  ButtonProps,
  DatePicker,
  Dropdown,
  DropdownProps,
  Input,
  theme,
} from "antd";
import { SearchProps } from "antd/es/input";
import React from "react";
import styled from "styled-components";
import type { RangePickerProps, DatePickerProps } from "antd/es/date-picker";

const Root = styled.div`
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 1px;
  border-radius: 3px;
  padding: 10px;
`;
const Space = styled.div`
  display: flex;
  flex-grow: 1;
`;
const Gap = styled.div`
  display: flex;
  flex-grow: 1;
`;
export interface IToolbarProps {
  searchProps?: SearchProps;
  newBtnProps?: ButtonProps;
  datePickerProps?: DatePickerProps;
  dateRangePickerProps?: RangePickerProps;
  extra?: React.ReactNode;
  dropdownProps?: DropdownProps & { btnProps?: ButtonProps };
}

export const Toolbar: React.FC<IToolbarProps> = ({
  searchProps,
  newBtnProps,
  datePickerProps,
  dateRangePickerProps,
  dropdownProps,
  extra,
}) => {
  const myTheme = theme.useToken();
  const {
    token: { colorBgLayout },
  } = myTheme;
  const { btnProps: dropdownBtnProps, ...deepDropdownProps } =
    dropdownProps || {};
  return (
    <Root style={{ background: colorBgLayout }}>
      <Space style={{ display: "flex" }}>
        {searchProps && (
          <div>
            <Input.Search {...searchProps} />
          </div>
        )}
        {datePickerProps && (
          <div>
            <DatePicker {...datePickerProps} />
          </div>
        )}
        {dateRangePickerProps && (
          <div>
            <DatePicker.RangePicker {...dateRangePickerProps} />
          </div>
        )}
        <Gap />
        {extra}
        {dropdownProps && (
          <Dropdown {...deepDropdownProps}>
            <Button type="primary" {...dropdownBtnProps} />
          </Dropdown>
        )}
        {newBtnProps && (
          <Button type="primary" {...newBtnProps}>
            {newBtnProps.title}
          </Button>
        )}
      </Space>
    </Root>
  );
};
