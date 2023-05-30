import { checkDEV } from "@apollo/client/utilities/globals";
import { QKeywordPerson } from "app/graph.queries/persons/types";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  INotify,
  IPayment,
  IPerson,
  IPaymentForm,
  ITx,
  notification,
  notifyObject,
  Payments,
  PAYMENT_DIALOG_TYPE,
  TxType,
  LIST_ACTIONS,
  IPaymentCategory,
  IBank,
  IOrgBank,
  ICheque,
  expenditures,
  IExpenditureAction,
  IIncomeActions,
  AccountAction,
} from "ui";
import { BOOLEAN_STRING } from "ui/components/types";
import { dummy } from "../../dummy";
import { useBankAction } from "../banks/actions";
import { useChequeAction } from "../cheques/actions";
import { usePaymentAction } from "./actions/payment";
import { usePaymentCategoryAction } from "./actions/payment_category";
import { useTransactionAction } from "./actions/transaction";
import { useDepositAction } from "../deposits/actions";
import { dayToTimeStamp } from "app/utils";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: PAYMENT_DIALOG_TYPE;
}
const dialogNewPayment: Partial<IPaymentState> = {
  dialogType: PAYMENT_DIALOG_TYPE.NEW_PAYMENT,
  drawerTitle: "New Payment",
};
export default function PaymentComponent() {
  const {
    paymentSummaryEmp,
    getPaymentSumByEmp,
    createPayment,
    getPayments,
    payments,
    payment,
    persons,
    setPayment,
    setPaymentQuery,

    deletePayment,
    getPersons,
    updatePayment,
  } = usePaymentAction();
  const {
    paymentCategories,
    createPaymentCategory,
    updatePaymentCategory,
    deletePaymentCategory,
  } = usePaymentCategoryAction();
  const { activeBanks: banks } = useBankAction();
  const {
    setTransactions,
    transactions,
    getTransactionsById,
    deleteTransaction,
  } = useTransactionAction();
  const { cheques } = useChequeAction();
  const { getPersonDepositBalance } = useDepositAction();
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPaymentState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const [paymentForm, setPaymentForm] = useState<Partial<IPaymentForm>>({});
  const [editPaymentForm, setEditPaymentForm] = useState<Partial<IPaymentForm>>(
    {}
  );
  const [paymentTxs, setPaymentTxs] = useState<ITx[]>();
  const [editedPaymentTxs, setEditedPaymentTxs] = useState<ITx[]>();
  const [client, setClient] = useState<IPerson>();
  const [isEditPayment, setEditPayment] = useState<boolean>();

  const [txType, setTxType] = useState<TxType>();
  const [personQuery, setPersonQuery] = useState<{
    keyword: QKeywordPerson;
    limit: number;
    skip: number;
  }>();

  const [api, contextHolder] = notification.useNotification();
  const openNotification: INotify = (type, props) => {
    api[type](notifyObject(props));
  };
  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  useEffect(() => {
    (async () => {
      const { keyword, limit, skip } = personQuery || {};
      getPersons(keyword, limit, skip, { notify: openNotification });
    })();
  }, [JSON.stringify(personQuery)]);
  useEffect(() => {
    setPaymentQuery({
      dateFilter: {
        date_stamp_from: dayToTimeStamp(new Date()),
        date_stamp_to: dayToTimeStamp(new Date()),
      },
    });
  }, []);
  const valueFields = (allFields: any) => {
    const newValues: any = {};
    for (const key in allFields) {
      if (Object.prototype.hasOwnProperty.call(allFields, key)) {
        const element = allFields[key];
        if (allFields[key]) newValues[key] = allFields[key];
      }
    }
    return newValues;
  };
  const getClientName = useCallback(() => {
    if (client && paymentForm) {
      const { last_name, first_name } = client.profile || {};
      return `${last_name || ""} ${first_name || ""}`.trim();
    }
  }, [JSON.stringify(paymentForm), JSON.stringify(client)]);
  const onActionClick =
    (type: TxType) =>
    (
      action: LIST_ACTIONS,
      item: IPaymentCategory,
      options?: {
        callback?: () => void;
        prevItem?: IPaymentCategory;
      }
    ) => {
      if (LIST_ACTIONS.DELETE === action) {
        openNotification("warning", {
          key: "delete-pay-cat-warning",
          message: "Warning",
          description: `Sure you want to delete category ${item.title}?`,
          btn: [
            {
              children: "Cancel",
              type: "primary",
              onClick() {
                api.destroy("delete-pay-cat-warning");
              },
            },
            {
              children: "Proceed",
              onClick() {
                api.destroy("delete-pay-cat-warning");
                deletePaymentCategory(item._id, type, {
                  notify: openNotification,
                }).then(options?.callback);
              },
            },
          ],
        });
      } else {
        if (options?.prevItem?._id) {
          updatePaymentCategory(options?.prevItem?._id, item, type, {
            notify: openNotification,
          }).then(options?.callback);
        } else {
          openNotification("error", {
            key: "update-pay-cat-error",
            message: "Error",
            description: "Payment Category ID can not be null",
          });
        }
      }
    };
  const resetPaymentForm = () => {
    setPaymentForm({});
    setEditPaymentForm({});
    setEditedPaymentTxs(undefined);
    setEditPayment(false);
    setClient(undefined);
    closeDialog();
  };
  //TODO: DISPLAY CATEGORIES ON THE NEW PAYMENT PAGE
  return (
    <>
      {contextHolder}
      <Payments
        toolbarProps={{
          dateRangePickerProps: {
            defaultValue: [
              dayjs(new Date().toLocaleDateString(), "DD/MM/YYYY"),
              dayjs(new Date().toLocaleDateString(), "DD/MM/YYYY"),
            ],
            onChange(_, formatString) {
              setPaymentQuery({
                dateFilter: {
                  date_stamp_from: dayToTimeStamp(new Date(formatString[0])),
                  date_stamp_to: dayToTimeStamp(new Date(formatString[1])),
                },
              });
            },
          },
          newBtnProps: {
            style: { marginLeft: 10 },
            onClick: () => {
              resetPaymentForm();
              setState({
                openDrawer: true,
                ...dialogNewPayment,
              });
            },
            title: "New Payment",
          },
          extra: {
            categoryBtnProps: {
              onClick: () =>
                setState({
                  openDrawer: true,
                  dialogType: PAYMENT_DIALOG_TYPE.CATEGORIES,
                  drawerTitle: "Payment Categories",
                }),
            },
          },
        }}
        drawerProps={{
          title: state.drawerTitle,
          open: state.openDrawer,
          drawerType: state.dialogType,
          onClose: () =>
            setState({
              openDrawer: false,
              drawerTitle: undefined,
              dialogType: undefined,
            }),
          size: "large",
        }}
        tabsProps={{
          onChange(activeKey) {
            if (activeKey === "receiver") {
              getPaymentSumByEmp({ notify: openNotification });
            }
          },
        }}
        paymentCategoryProps={{
          incomeProps: {
            listProps: {
              onActionClick: onActionClick(TxType.income),
              onCreateItem(values, options) {
                values.type = "income";
                createPaymentCategory(values, TxType.income, {
                  notify: openNotification,
                }).then(options?.callback);
              },
              dataSource: paymentCategories?.income,
            },
          },
          expenditureProps: {
            listProps: {
              dataSource: paymentCategories?.expenditure,
              onActionClick: onActionClick(TxType.expenditure),
              onCreateItem(values, options) {
                values.type = "expenditure";
                createPaymentCategory(values, TxType.expenditure, {
                  notify: openNotification,
                }).then(options?.callback);
              },
            },
          },
        }}
        paymentTableProps={{
          payments: payments?.map((i) => ({ ...i, key: i._id })),
          showTx: false,
          banks: banks as IOrgBank[],
          tableProps: {
            rowSelection: {
              selectedRowKeys: [0],
              type: "radio",
              onSelect(record) {
                setState({
                  openDrawer: true,
                  drawerTitle: "Payment Transactions",
                  dialogType: PAYMENT_DIALOG_TYPE.PAYMENT_TXS,
                });
                setPayment(record);
                setTransactions(undefined);
                if (record.tx_ids && record.tx_ids?.length > 0) {
                  getTransactionsById(record.tx_ids);
                }
              },
            },
          },
        }}
        receiverProps={{
          paymentSummary: paymentSummaryEmp,
        }}
        paymentTxsProps={{
          payment: payment && { ...payment, txs: transactions },
          categories:
            paymentCategories?.expenditure?.concat(paymentCategories?.income) ||
            [],
          onOpenUpdatePage(payment) {
            setPaymentForm({
              ...payment,
              created_at: moment(new Date(parseInt(payment.created_at))), //new Date(Number(payment.created_at)),
              use_client: Boolean(payment.person_id),
            } as any);
            setEditPayment(true);
            setClient(payment?.person);
            setPaymentTxs(payment.txs);
            setState({
              dialogType: PAYMENT_DIALOG_TYPE.NEW_PAYMENT,
            });
          },
          onResolvePayment(unresolved) {
            openNotification("warning", {
              key: "resolve-payment",
              message: "Warning",
              description: `Sure, you want to ${
                unresolved === BOOLEAN_STRING.yes
                  ? "resolve"
                  : "mark this as unresolved"
              } payment?`,
              btn: [
                {
                  children: "Cancel",
                  type: "primary",
                  onClick: () => api.destroy("resolve-payment"),
                },
                {
                  children: "Proceed",
                  onClick: () => {
                    api.destroy("resolve-payment");
                    updatePayment({ unresolved }, undefined, {
                      notify: openNotification,
                    });
                  },
                },
              ],
            });
          },
          onDeletePayment(payment) {
            deletePayment(payment._id, { notify: openNotification }).then(
              () => {
                closeDialog();
              }
            );
          },

          txTableProps: {
            onDeleteTx(tx) {
              openNotification("warning", {
                key: "delete-tx-warning",
                message: "Warning",
                description: `Sure, you want to delete this transaction worth - ${Number(
                  tx.amount
                ).toLocaleString()}. ${
                  payment?.tx_ids.length === 1 &&
                  "Note also that when this transaction is deleted, the payment would also be deleted"
                }`,
                btn: [
                  {
                    children: "Cancel",
                    type: "primary",
                    onClick: () => api.destroy("delete-tx-warning"),
                  },
                  {
                    children: "Proceed",
                    onClick: () => {
                      api.destroy("delete-tx-warning");
                      if (payment?._id) {
                        deleteTransaction(tx._id, payment?._id, {
                          notify: openNotification,
                        }).then(() => {
                          closeDialog();
                          getPayments({ notify: openNotification });
                        });
                      }
                    },
                  },
                ],
              });
            },
            onShowReceipt: () => {
              setState({
                dialogType: PAYMENT_DIALOG_TYPE.SHOW_RECEIPT,
                drawerTitle: "Payment Receipt",
              });
            },
          },
        }}
        paymentReceiptProps={{
          org: dummy.settings.org,
          onBack: () => {
            setState({
              dialogType: PAYMENT_DIALOG_TYPE.PAYMENT_TXS,
              drawerTitle: "Payment Transactions",
            });
          },
        }}
        newPaymentProps={{
          banks: banks as IBank[],
          isEdit: isEditPayment,
          categories:
            paymentCategories?.expenditure?.concat(paymentCategories?.income) ||
            [],
          transactions: paymentTxs,
          clientName: getClientName(),
          resetTxs() {
            setPaymentTxs(undefined);
          },
          cheques: cheques?.map((cheque) => {
            const bank = banks?.find((bank) => bank?._id === cheque.bank_id);
            if (bank) {
              cheque.bank = bank;
              return cheque;
            }
          }) as ICheque[],
          formProps: {
            initialValues: paymentForm,
            onValuesChange(changedValues) {
              if (isEditPayment) {
                //setting payment for editing push a lot unnecessary values like person, emp. Need a clean slate
                setEditPaymentForm((state) => ({ ...state, ...changedValues }));
              } else {
                //Because I need to change pages like client page to select client and cat page to select cats
                setPaymentForm((state) => ({ ...state, ...changedValues }));
              }
            },
            onFinish(values) {
              if (isEditPayment) {
                updatePayment(editPaymentForm, editedPaymentTxs, {
                  notify: openNotification,
                }).then(() => {
                  resetPaymentForm();
                });
              } else {
                if (!values.total_amount) {
                  return openNotification("error", {
                    key: "payment-amount-error",
                    message: "Error",
                    description: "No amount found in this payment",
                  });
                }
                //TODO:// Maintain the reciever query state, and update it to fetch new data on every new payment
                if (values.use_client) {
                  values.person_id = client?.person_id;
                  delete values.client;
                }
                delete values.use_client;
                delete values.category_id;
                values.created_at = dayToTimeStamp(
                  new Date(
                    moment(values.created_at || new Date()).format("YYYY-MM-DD")
                  )
                );
                const tx_type =
                  expenditures.indexOf(values.action_type) === -1
                    ? TxType.income
                    : TxType.expenditure;
                const txs = paymentTxs?.map((i) => ({
                  ...i,
                  tx_type,
                  created_at: values.created_at,
                  amount: Number(i.amount),
                }));
                const payment: IPayment = {
                  ...values,
                  total_amount:
                    txs?.map((i) => i.amount).reduce((a, b) => a + b) ||
                    Number(values.total_amount),
                  tx_type,
                };
                createPayment(payment, txs, {
                  notify: openNotification,
                }).then(() => {
                  setPaymentForm({});
                  setPaymentTxs(undefined);
                  closeDialog();
                });
              }
            },
          },
          openClient(form) {
            setState({
              dialogType: PAYMENT_DIALOG_TYPE.SHOW_CLIENT,
              drawerTitle: "Select Client",
            });
            setPaymentForm(
              valueFields({
                ...paymentForm,
                ...form.current?.getFieldsValue(),
              }) as Partial<IPaymentForm>
            );
          },
          openPaymentCategory(form, txType) {
            setState({
              dialogType: PAYMENT_DIALOG_TYPE.NEW_PAYMENT_CAT,
              drawerTitle: "Select Payment Categories(s)",
            });
            setTxType(txType);
            setPaymentForm(
              valueFields({
                ...paymentForm,
                ...form.current?.getFieldsValue(),
              }) as Partial<IPaymentForm>
            );
          },
        }}
        personProps={{
          persons: persons?.map((i) => ({ ...i, key: i.person_id })),
          toolbarProps: {
            dateRangePickerProps: {},
          },
          tableProps: {
            rowSelection: {
              type: "radio",
              selectedRowKeys: [],
              async onChange(selectedRowKeys) {
                const person_id = selectedRowKeys[0] as number;
                const client = persons?.find(
                  (item) => item.person_id === person_id
                );
                client && setClient(client);
                if (
                  client &&
                  [
                    AccountAction.deposit_withdrawal,
                    AccountAction.use_deposit,
                  ].indexOf(paymentForm.action_type as AccountAction) !== -1
                ) {
                  const personDepositBalance = await getPersonDepositBalance(
                    client?.person_id,
                    {
                      notify: openNotification,
                    }
                  );
                  if (personDepositBalance) {
                    const {
                      deposit = 0,
                      used = 0,
                      withdrawn = 0,
                    } = personDepositBalance;
                    const bal = deposit - used - withdrawn;
                    setPaymentForm({ ...paymentForm, total_amount: bal });
                  }
                }
                setState({
                  ...dialogNewPayment,
                });
              },
            },
          },
          onBack: () => {
            setState({
              ...dialogNewPayment,
            });
          },
        }}
        addPaymentCatProps={{
          isEdit: isEditPayment,
          incomeCats: paymentCategories?.income,
          expenditureCats: paymentCategories?.expenditure,
          txType,
          paymentTxs,
          onBack: () => {
            setState({
              ...dialogNewPayment,
            });
          },
          onContinueEdit(values) {
            if (!values) {
              //show error
            }

            if (paymentTxs && values)
              for (let i = 0; i < values.length; i++) {
                values[i] = { ...values[i], _id: paymentTxs[i]._id };
                paymentTxs[i] = { ...paymentTxs[i], ...values[i] };
              }
            setEditedPaymentTxs(values);
            setPaymentTxs(structuredClone(paymentTxs));
            setState({
              ...dialogNewPayment,
            });
          },
          onContinue(values) {
            setPaymentTxs(values);
            setState({
              ...dialogNewPayment,
            });
          },
        }}
      />
    </>
  );
}
