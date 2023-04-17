import {
  Button,
  Dropdown,
  FormInstance,
  Space,
  Table,
  TableProps,
  theme,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IDepartment } from "ui/components/Departments";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { ILogin, IEmployee } from "../../types";
import { getLoginColumns, loginForm } from "./data";

const Root = styled.div``;
const Title = styled.h3``;
const Description = styled.div`
  color: gray;
  line-height: 2em;
`;
const TableContainer = styled.div`
  margin: 20px 0px;
`;

export interface IEmpDepartments {
  departments?: IDepartment[];
  employee?: IEmployee;
  tableProps?: TableProps<ILogin>;
  onAddDepartment?: (dept: IDepartment, login?: ILogin) => void;
  onRemoveDepartment?: (dept: IDepartment) => void;
  onEditLogin?: (dept: IDepartment, login: ILogin) => void;
}

function StaffDepartmentFunc({
  departments,
  employee,
  tableProps,
  onAddDepartment,
  onRemoveDepartment,
  onEditLogin,
}: IEmpDepartments) {
  const [login, setLogin] = useState<ILogin>();
  const [isEdit, setEdit] = useState<boolean>();
  const [dept, setDept] = useState<IDepartment>();
  const formRef = React.useRef<FormInstance>(null);
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const newDepartments = departments?.filter(
    (item) => !employee?.department_ids?.includes(item._id as string)
  );
  return (
    <Root>
      {dept?.app && (
        <>
          <Title>Login for {dept.name}</Title>
          <Description>
            To update another login info, close this panel first.
          </Description>
          <Form
            formRef={formRef}
            formProps={{
              style: {
                background: colorBgLayout,
                padding: 20,
                borderRadius: 6,
                marginBottom: 20,
              },
              title: "Department Login",
              name: "new-department-form",
              layout: "horizontal",
              labelCol: { span: 10 },
              wrapperCol: { span: 14 },
              initialValues: { ...login, password: "" },
              onFinish(values) {
                if (isEdit) {
                  onEditLogin?.(dept, values);
                } else {
                  onAddDepartment?.(dept, values);
                }
                setDept(undefined);
              },
            }}
            items={[
              ...loginForm,
              {
                fieldType: FORM_FIELD_TYPES.FIELDS,
                itemProps: {
                  wrapperCol: { span: 14, offset: 10 },
                },
                fieldProps: [
                  {
                    fieldType: FORM_FIELD_TYPES.BUTTON,
                    fieldProps: {
                      style: { marginRight: 20 },
                      children: "Cancel",
                      onClick: () => {
                        setDept(undefined);
                      },
                    },
                  },
                  {
                    fieldType: FORM_FIELD_TYPES.BUTTON,
                    fieldProps: {
                      type: "primary",
                      htmlType: "submit",
                      children: (isEdit ? "Update " : "Create ") + "Login",
                    },
                  },
                ],
              },
            ]}
          />
        </>
      )}
      {newDepartments && newDepartments.length > 0 && (
        <Dropdown
          menu={{
            items: newDepartments?.map((dept) => ({
              label: dept.name,
              key: dept._id as string,
            })),
            onClick({ key }) {
              const dept = departments?.find((item) => item._id === key);
              if (dept) {
                if (dept?.app) {
                  setDept(dept);
                  setEdit(false);
                } else {
                  onAddDepartment?.(dept);
                }
              }
            },
          }}
        >
          <Button>Add Department</Button>
        </Dropdown>
      )}
      <TableContainer>
        <Title>Login Details</Title>
        <Table
          {...tableProps}
          dataSource={employee?.logins}
          columns={getLoginColumns(
            departments,
            (keyIndex) => (value, record) => {
              if (keyIndex === "action") {
                return (
                  <Space>
                    <Tooltip title="Edit">
                      <EditOutlined
                        onClick={() => {
                          const dept = departments?.find(
                            (item) => item._id === record?.department_id
                          );
                          setEdit(true);
                          setDept(dept);
                          setLogin(record);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <DeleteOutlined
                        onClick={() => {
                          const dept = departments?.find(
                            (item) => item._id === record?.department_id
                          );
                          dept && onRemoveDepartment?.(dept);
                        }}
                      />
                    </Tooltip>
                  </Space>
                );
              } else return value;
            }
          )}
          size="small"
        />
      </TableContainer>
    </Root>
  );
}

export const EmpDepartments = React.memo(StaffDepartmentFunc);
