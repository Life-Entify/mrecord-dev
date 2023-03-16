import { Button, ButtonProps, Space } from "antd";
import React, { ReactElement } from "react";

export * from "@ant-design/icons";
export type { TableColumnType } from "antd";
export { notification, Button, Space } from "antd";
export * from "./table.header";
export * from "./errors";

export type INotificationTypes = "warning" | "info" | "success" | "error";

interface INotificationProps {
  key: React.Key;
  message: React.ReactNode;
  description?: React.ReactNode;
  btn?: React.ReactNode;
  onClose?: () => void;
  duration?: number;
}
export interface INotifyObjectProps extends Omit<INotificationProps, "btn"> {
  btn?: ButtonProps[];
}
export const notifyObject = (props: INotifyObjectProps): INotificationProps => {
  return {
    ...props,
    btn: React.createElement(
      Space,
      {},
      props?.btn?.map((prop) => React.createElement(Button, prop))
    ),
  };
};
