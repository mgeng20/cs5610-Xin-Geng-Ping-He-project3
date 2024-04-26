import React from "react";
import { Table } from "antd";

const SharedPasswordList = ({ passwords }) => {
  const columns = [
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
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
    },
  ];

  const data = passwords
    .filter((password) =>
      password.shareRequests.some((request) => request.status === "accepted")
    )
    .map((password) => ({
      key: password._id,
      service: password.service,
      password: password.password,
      owner: password.user.username,
    }));

  return (
    <div>
      <h2>Shared Passwords</h2>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default SharedPasswordList;