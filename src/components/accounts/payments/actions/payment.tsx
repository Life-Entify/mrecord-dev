import { useEmployee } from "app/graph.hooks/employee";
import { usePayment } from "app/graph.hooks/payment";
import { usePerson } from "app/graph.hooks/person";
import { QKeywordPerson } from "app/graph.queries/persons/types";
import { selectUser } from "app/redux/user.core";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IPayment, INotify, ITx, IDateFilter, IPaymentSummaryEmp } from "ui";
import { IPerson } from "ui/components/Person";
export interface IActionOptions {
  notify: INotify;
}
export function usePaymentAction() {
  const {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentSummaryByEmp,
  } = usePayment();
  const { getPersons, getPersonsByPersonID } = usePerson({
    person: ["_id", "person_id", "profile"],
    profile: ["last_name", "first_name"],
  });
  const { getEmployeesByEmployeeId } = useEmployee({
    employee: ["_id", "employee_id", "person"],
    person: ["profile"],
    profile: ["last_name", "first_name"],
  });
  const user = useSelector(selectUser);
  const [payments, setPayments] = useState<IPayment[]>();
  const [paymentSummaryEmp, setPaymentSummaryEmp] =
    useState<IPaymentSummaryEmp[]>();
  const [paymentQuery, setPaymentQuery] = useState<{
    keyword?: Partial<IPayment>;
    limit?: number;
    skip?: number;
  }>();
  const [payment, setPayment] = useState<IPayment>();
  const [persons, setPersons] = useState<IPerson[]>();
  const getPaymentSumByEmp = async (
    dateFilter: IDateFilter,
    filter?: Partial<IPayment>,
    options?: { notify: INotify; noise?: boolean }
  ) => {
    try {
      const { data } = await getPaymentSummaryByEmp({
        variables: {
          filter,
          // date_filter: dateFilter,
        },
      });
      let { paymentSummaryEmp: empData } = data || {};
      const personIds = empData?.map((i) => i.employee?.person_id);
      if (personIds?.length) {
        const { data: personData } = await getPersonsByPersonID({
          variables: {
            ids: personIds,
          },
        });
        const { persons } = personData || {};
        empData = empData?.map((emp) => {
          const empPerson = persons?.find(
            (person) => person.person_id === emp.employee.person_id
          );
          return { ...emp, employee: { ...emp.employee, person: empPerson } };
        });
      }
      setPaymentSummaryEmp(empData);
    } catch (e) {
      options?.noise &&
        options?.notify?.("error", {
          key: "get-emp-summary-error",
          message: "Error",
          description: (e as Error).message,
        });
    }
  };
  const getPsons = async (
    keyword?: QKeywordPerson,
    limit?: number,
    skip?: number,
    options?: { notify: INotify; noise?: boolean }
  ) => {
    try {
      const { data } = await getPersons({
        variables: {
          keyword,
          limit,
          skip,
        },
      });
      const { persons } = data || {};
      setPersons(persons);
      options?.noise &&
        options?.notify?.("success", {
          key: "get-persons-successful",
          message: "Success",
          description: "fetched persons, successfully",
        });
    } catch (e) {
      options?.noise &&
        options?.notify?.("error", {
          key: "get-persons-error",
          message: "Error",
          description: (e as Error).message,
        });
    }
  };
  const getPaymts = useCallback(
    async (options?: { notify?: INotify; noise?: boolean }) => {
      const { keyword, limit, skip } = paymentQuery || {};
      try {
        const { data } = await getPayments({
          variables: {
            keyword,
            limit,
            skip,
          },
        });
        let { payments } = data || {};
        const personIds = payments
          ?.map((i) => i.person_id)
          .filter((value, index, record) => record.indexOf(value) === index);
        const employee_ids = payments
          ?.map((i) => i.employee_id)
          .filter((value, index, record) => record.indexOf(value) === index);
        if (personIds && personIds.length > 0) {
          const { data: personData } = await getPersonsByPersonID({
            variables: {
              ids: personIds as number[],
            },
          });
          const { persons } = personData || {};
          payments = payments?.map((payment) => {
            const person = persons?.find(
              (person) => person.person_id === payment.person_id
            );
            payment.person = person;
            return payment;
          });
        }
        if (employee_ids && employee_ids.length > 0) {
          const { data: empData } = await getEmployeesByEmployeeId({
            variables: {
              ids: employee_ids,
            },
          });
          const { employees } = empData || {};
          payments = payments?.map((i) => {
            const employee = employees?.find(
              (emp) => emp.employee_id === i.employee_id
            );
            if (employee) i.employee = employee;
            return i;
          });
        }
        setPayments(payments);
        options?.noise &&
          options?.notify?.("success", {
            key: "get-pay-success",
            message: "Success",
            description: "Fetched payments",
          });
      } catch (e) {
        options?.notify?.("error", {
          key: "get-pay-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [JSON.stringify(paymentQuery)]
  );
  useEffect(() => {
    getPaymts();
  }, [JSON.stringify(paymentQuery)]);
  const deletePaymt = useCallback(
    async (paymentId?: string, options?: IActionOptions) => {
      if (!paymentId) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No Payment ID found!",
        });
      }
      try {
        await deletePayment({
          variables: { _id: paymentId },
        });
        await getPaymts({ ...options });
        options?.notify?.("success", {
          key: "delete-pay-success",
          message: "Success",
          description: "Payment deleted",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
        throw e;
      }
    },
    [!!updatePayment, JSON.stringify(payment)]
  );
  const updatePaymt = useCallback(
    async (pay: Partial<IPayment>, txs?: ITx[], options?: IActionOptions) => {
      if (Object.keys(pay).length === 0 && (!txs || txs?.length === 0)) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      try {
        const { data } = await updatePayment({
          variables: {
            payment: pay,
            _id: payment?._id as string,
            transactions: txs,
          },
        });
        const { payment: newPayment } = data || {};
        setPayment(newPayment);
        await getPaymts({ notify: options?.notify });
        options?.notify?.("success", {
          key: "update-pay-success",
          message: "Success",
          description: "Payment updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
        throw e;
      }
    },
    [!!updatePayment, JSON.stringify(payment)]
  );
  const createPaymt = useCallback(
    async (
      payment: Partial<IPayment>,
      txs?: Partial<ITx>[],
      options?: IActionOptions
    ) => {
      try {
        await createPayment({
          variables: {
            payment: { ...payment, employee_id: user.employee_id } as IPayment,
            transactions: txs as ITx[],
          },
        });
        await getPaymts({ notify: options?.notify });
        return options?.notify?.("success", {
          key: "create-pay-success",
          message: "Success",
          description: "Payment created!",
        });
      } catch (e) {
        return options?.notify?.("error", {
          key: "create-pay-error",
          message: "Error",
          description: (e as Error).message,
        });
        throw e;
      }
    },
    [!!createPayment, JSON.stringify(user)]
  );
  useEffect(() => {
    getPaymts();
  }, []);

  return {
    paymentSummaryEmp,
    getPaymentSumByEmp,
    payments,
    payment,
    persons,
    setPayment,
    getPayments: getPaymts,
    createPayment: createPaymt,
    updatePayment: updatePaymt,
    deletePayment: deletePaymt,
    getPersons: getPsons,
  };
}
