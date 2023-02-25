import { Collapse, CollapsePanelProps, CollapseProps, Empty, Tag } from "antd";
import React from "react";
import styled from "styled-components";
import { IPaymentTableProps, PaymentTable } from "../Tables";
import { ICashBundle } from "../types";

const Root = styled.div``;

export interface IBundledCashProps {
  bundles?: ICashBundle[];
  collapseProps?: CollapseProps;
  collapsePanelProps?: Omit<CollapsePanelProps, "key" | "header" | "extra">;
  paymentTableProps?: Omit<IPaymentTableProps, "payments" | "showTx">;
}

export function BundledCash({
  bundles,
  collapsePanelProps,
  collapseProps,
  paymentTableProps,
}: IBundledCashProps) {
  if (!bundles) return <Empty />;
  return (
    <Root>
      <Collapse {...collapseProps}>
        {bundles?.map((bundle, index) => {
          return (
            <Collapse.Panel
              key={`bundle-items-${index}`}
              header={bundle.title}
              extra={<Tag>{bundle.total_amount}</Tag>}
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
