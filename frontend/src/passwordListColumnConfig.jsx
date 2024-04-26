import { Space } from "antd";
import dayjs from "dayjs";
import React from "react";
import PasswordCell from "./components/PasswordCell";

export function generateColumnConfig(
  onClickUpdate,
  onClickDelete,
  onClickShare
) {
  return [
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },

    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render(value) {
        return <PasswordCell password={value} />;
      },
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render(value) {
        const date = dayjs(value);
        return <div>{date.format("YYYY-MM-DD")}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => onClickUpdate(record)}>Update</a>
          <a onClick={() => onClickDelete(record)}>Delete</a>
          <a onClick={() => onClickShare(record)}>Share</a>
        </Space>
      ),
    },
  ];
}
