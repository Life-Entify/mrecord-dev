import { Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { AllBundles, IAllBundlesProps } from "./AllBundles";

const Root = styled.div``;

export interface IBundledCashProps {
  allBundleProps?: IAllBundlesProps;
}

function BundledCashFun({ allBundleProps }: IBundledCashProps) {
  return (
    <Root>
      <Tabs type="card" size="small">
        <Tabs.TabPane key={11} tab="All Bundles">
          <AllBundles {...allBundleProps} />
        </Tabs.TabPane>
        <Tabs.TabPane key={12} tab="Unused Bundles">
          <AllBundles {...allBundleProps} />
        </Tabs.TabPane>
        <Tabs.TabPane key={13} tab="Used Bundles">
          <AllBundles {...allBundleProps} />
        </Tabs.TabPane>
      </Tabs>
    </Root>
  );
}

export const BundledCash = React.memo(BundledCashFun);
