import React from "react";

export interface ICategoryListItem {
  _id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export enum LIST_ACTIONS {
  EDIT = "edit",
  DELETE = "delete",
}