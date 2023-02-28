import { Descriptions, DescriptionsProps } from "antd";
import { DescriptionsItemProps } from "antd/es/descriptions/Item";
import React, { ReactNode } from "react";
import styled from "styled-components";

const Root = styled.div`
  background: ${(props) => props.theme.infoBoardBg};
  padding: 20px;
  border-radius: 6px;
`;
const Header = styled.div`
  color: gray;
`;
export interface IInfoBoardProps<T extends string | number | symbol> {
  title?: React.ReactNode;
  data?: Record<T, ReactNode>;
  dataMap?: Record<T, ReactNode>;
  descriptionProps?: DescriptionsProps;
  descriptionItemProps?: DescriptionsItemProps;
  skipMap?: T[];
  includeMap?: T[];
  replaceMap?: (
    value: React.ReactNode,
    key: T,
    data: Record<T, React.ReactNode>
  ) => React.ReactNode;
}
export function InfoBoard<T extends string | number | symbol>({
  title,
  data,
  dataMap,
  skipMap,
  includeMap,
  replaceMap,
  descriptionProps,
  descriptionItemProps,
}: IInfoBoardProps<T>) {
  return (
    <Root>
      <Descriptions title={title} layout="vertical" {...descriptionProps}>
        {data &&
          Object.entries(data).map(([key, value], index) => {
            if (includeMap && !includeMap.includes(key as T)) {
              return null;
            } else if (skipMap && skipMap.indexOf(key as T) !== -1) return null;
            if (key === "__typename") return null;
            return (
              <Descriptions.Item
                {...descriptionItemProps}
                key={index}
                label={<Header>{dataMap?.[key as T] || key}</Header>}
              >
                {
                  (replaceMap
                    ? replaceMap(value as React.ReactNode, key as T, data)
                    : typeof value === "string" || typeof value === "number"
                    ? value
                    : null) as React.ReactNode
                }
              </Descriptions.Item>
            );
          })}
      </Descriptions>
    </Root>
  );
}
