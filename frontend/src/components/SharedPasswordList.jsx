import { Table } from "antd";
import React from "react";
import useSWR from "swr";
import { axiosInstance } from "../util";
import PasswordCell from "./PasswordCell";

const SharedPasswordList = () => {
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
      render(value) {
        return <PasswordCell password={value} />;
      },
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
    },
  ];

  const { data = [], isLoading } = useSWR("getSharedPasswords", () =>
    axiosInstance.get("api/passwords/shared").then((res) => res.data)
  );

  const passwordList = data.map(({ service, password, user }) => ({
    service,
    password,
    owner: user.username,
  }));

  return (
    <div style={{ margin: 20 }}>
      <h2>Shared Passwords</h2>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={passwordList}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default SharedPasswordList;
