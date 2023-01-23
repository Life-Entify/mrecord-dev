import React from "react";

interface IAppInitAdapter {
  children: React.ReactNode;
}
export const AppInitAdapter: React.FC<IAppInitAdapter> = ({ children }) => {

  
  return <>{children}</>;
};
