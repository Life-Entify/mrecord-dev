import React from 'react';
import { Breadcrumb as AntBreadcrum } from 'antd';

export const Breadcrumb: React.FC = function() {
  return (
    <AntBreadcrum style={{ margin: '16px 0' }}>
      <AntBreadcrum.Item>User</AntBreadcrum.Item>
      <AntBreadcrum.Item>Bill</AntBreadcrum.Item>
    </AntBreadcrum>
  );
};
