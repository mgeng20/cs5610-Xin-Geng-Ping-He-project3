import { Space } from "antd";
import dayjs from "dayjs";
import React from "react";

const passwordListColumnConfig = [
  {
    title: "Service",
    dataIndex: "service",
    key: "service",
  },

  {
    title: "Password",
    dataIndex: "password",
    key: "password",
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
        <a>Update</a>
        <a>Delete</a>
        <a>Share</a>
      </Space>
    ),
  },
];

export default passwordListColumnConfig;
