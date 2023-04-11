import { QKeywordPerson } from "app/graph.queries/persons/types";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
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
} from "ui";
import { dummy } from "../../dummy";
import { useBankAction } from "../banks/actions";
import { usePaymentAction } from "./actions/payment";
import { usePaymentCategoryAction } from "./actions/payment_category";
import { useTransactionAction } from "./actions/transaction";
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
    createPayment,
    updatePayment,
    payments,
    payment,
    persons,
    setPayment,
    getPersons,
  } = usePaymentAction();
  const {
    paymentCategories,
    createPaymentCategory,
    updatePaymentCategory,
    deletePaymentCategory,
  } = usePaymentCategoryAction();
  const { banks } = useBankAction();
  const { setTransactions, transactions, getTransactionsById } =
    useTransactionAction();
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPaymentState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const [paymentForm, setPaymentForm] = useState<Partial<IPaymentForm>>({});
  const [paymentTxs, setPaymentTxs] = useState<ITx[]>();
  const [client, setClient] = useState<IPerson>();

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
  //TODO: DISPLAY CATEGORIES ON THE NEW PAYMENT PAGE
  return (
    <>
      {contextHolder}
      <Payments
        toolbarProps={{
          newBtnProps: {
            style: { marginLeft: 10 },
            onClick: () =>
              setState({
                openDrawer: true,
                ...dialogNewPayment,
              }),
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
          payments: payments,
          showTx: false,
          banks,
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
                getTransactionsById(record.tx_ids);
              },
            },
          },
        }}
        receiverProps={{
          receivers: dummy.receivers,
        }}
        paymentTxsProps={{
          payment: payment && { ...payment, txs: transactions },
          categories:
            paymentCategories?.expenditure.concat(paymentCategories.income) ||
            [],
          txTableProps: {
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
          banks,
          categories: paymentCategories,
          transactions: paymentTxs,
          txType,
          clientName: getClientName(),
          resetTxs() {
            setPaymentTxs(undefined);
          },
          cheques: [],
          formProps: {
            initialValues: paymentForm,
            onValuesChange(changedValues) {
              setPaymentForm((state) => ({ ...state, ...changedValues }));
            },
            onFinish(values) {
              if (values.use_client) {
                values.person_id = client?.person_id;
                delete values.client;
              }
              delete values.use_client;
              delete values.category_id;
              values.created_at = new Date(
                moment(values.created_at || new Date()).format("YYYY-MM-DD")
              )
                .getTime()
                .toString();
              const txs = paymentTxs?.map((i) => ({
                ...i,
                tx_type: txType,
                created_at: values.created_at,
                amount: Number(i.amount),
              }));
              const payment: IPayment = {
                ...values,
                total_amount: txs?.map((i) => i.amount).reduce((a, b) => a + b),
                tx_type: txType,
              };
              createPayment(payment, txs, {
                notify: openNotification,
              }).then(() => {
                setPaymentForm({});
                setPaymentTxs(undefined);
                closeDialog();
              });
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
              onChange(selectedRowKeys) {
                const person_id = selectedRowKeys[0] as number;
                const client = persons?.find(
                  (item) => item.person_id === person_id
                );
                client && setClient(client);
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
          incomeCats: paymentCategories?.income,
          expenditureCats: paymentCategories?.expenditure,
          txType,
          paymentTxs,
          onBack: () => {
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
