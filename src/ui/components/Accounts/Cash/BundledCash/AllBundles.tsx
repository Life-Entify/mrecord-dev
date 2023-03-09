import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  CollapsePanelProps,
  CollapseProps,
  Empty,
  Space,
  Tag,
  Tooltip,
} from "antd";
import React from "react";
import styled from "styled-components";
import { IPaymentTableProps, PaymentTable } from "../../Tables";
import { ICashBundle } from "../../types";

const Root = styled.div``;

export interface IAllBundlesProps {
  bundles?: ICashBundle[];
  collapseProps?: CollapseProps;
  collapsePanelProps?: Omit<CollapsePanelProps, "key" | "header" | "extra">;
  paymentTableProps?: Omit<IPaymentTableProps, "payments" | "showTx">;
  onMoveToBank?: (bundle: ICashBundle) => void;
  onEditBankMove?: (bundle: ICashBundle) => void;
  onShowUsages?: (bundle: ICashBundle) => void;
}

function AllBundlesFn({
  bundles,
  collapsePanelProps,
  collapseProps,
  paymentTableProps,
  onMoveToBank,
  onShowUsages,
  onEditBankMove,
}: IAllBundlesProps) {
  if (!bundles) return <Empty />;
  return (
    <Root>
      <Collapse {...collapseProps}>
        {bundles?.map((bundle, index) => {
          return (
            <Collapse.Panel
              key={`bundle-items-${index}`}
              header={
                <Space>
                  <div>{bundle.title}</div>
                  {!bundle.bankmove_id ? (
                    <>
                      <Button
                        size="small"
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveToBank && onMoveToBank(bundle);
                        }}
                      >
                        Move to bank
                      </Button>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowUsages && onShowUsages(bundle);
                        }}
                      >
                        usages
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowUsages && onShowUsages(bundle);
                        }}
                      >
                        usages
                      </Button>
                      {bundle.bank && (
                        <>
                          <Tag color="blue">{bundle.bank.bank}</Tag>
                          <EditOutlined
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditBankMove && onEditBankMove(bundle);
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                </Space>
              }
              extra={
                <Space>
                  <Tooltip title="Bundled Amount">
                    <Tag color={"geekblue"}>{bundle.total_amount}</Tag>
                  </Tooltip>
                  <Tooltip title="Amount used">
                    <Tag color={"red"}>{bundle.cashout_amount}</Tag>
                  </Tooltip>
                </Space>
              }
              {...collapsePanelProps}
            >
              <PaymentTable
                payments={bundle.payments}
                showTx
                {...paymentTableProps}
              />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </Root>
  );
}

export const AllBundles = React.memo(AllBundlesFn);
