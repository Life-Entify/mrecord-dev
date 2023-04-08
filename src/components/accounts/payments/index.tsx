import { QKeywordPerson } from "app/graph.queries/persons/types";
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
} from "ui";
import { dummy } from "../../dummy";
import { usePaymentAction } from "./actions";
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
  console.log(paymentForm);
  //TODO: DISPLAY CATEGORIES ON THE NEW PAYMENT PAGE
  return (
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
            onActionClick(type, item) {},
            dataSource: dummy.category,
          },
        },
      }}
      paymentTableProps={{
        payments: payments,
        showTx: false,
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
            },
          },
        },
      }}
      receiverProps={{
        receivers: dummy.receivers,
      }}
      paymentTxsProps={{
        payment,
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
        banks: dummy.orgBanks,
        clientName: getClientName(),
        cheques: [],
        formProps: {
          initialValues: paymentForm,
          onValuesChange(changedValues) {
            setPaymentForm((state) => ({ ...state, ...changedValues }));
          },
          onFinish(values) {
            values.person_id = client?.person_id;
            return console.log(values, paymentTxs);
            createPayment(values as IPayment, paymentTxs, {
              notify: openNotification,
            }).then(closeDialog);
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
        incomeCats: dummy.category,
        expenditureCats: dummy.category,
        txType,
        onBack: () => {
          setState({
            ...dialogNewPayment,
          });
        },
        onContinue(values) {
          setPaymentTxs(values["category-list"]);
          setState({
            ...dialogNewPayment,
          });
        },
      }}
    />
  );
}
