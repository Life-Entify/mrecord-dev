import { ConfigProvider } from "antd";
import { AliasToken } from "antd/es/theme/internal";
import React from "react";
import { ThemeProvider } from "styled-components";
import { IThemeComponents } from "./types";

export interface IProviderProps {
  children: React.ReactNode;
  appTheme: Partial<AliasToken & IThemeComponents> | undefined;
}
export const Provider: React.FC<IProviderProps> = function ({
  children,
  appTheme,
}) {
  return (
    <ConfigProvider
      theme={{
        token: appTheme,
      }}
    >
      <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
    </ConfigProvider>
  );
};
