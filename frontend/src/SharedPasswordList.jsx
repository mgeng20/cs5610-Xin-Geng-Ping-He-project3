import React from "react";
import { Table } from "antd";
import { generateColumnConfig } from "./passwordListColumnConfig";

const SharedPasswordList = ({ passwords }) => {
  const columnConfig = generateColumnConfig();

  return (
    <div>
      <h2>Shared Passwords</h2>
      <Table
        dataSource={passwords}
        columns={columnConfig}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default SharedPasswordList;