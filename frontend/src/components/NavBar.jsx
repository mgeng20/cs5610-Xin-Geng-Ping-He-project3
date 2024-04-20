import { Layout, Menu, theme } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const menuItems = [
  { label: "Home", key: "/" },
  { label: "Login", key: "/login" },
  { label: "Signup", key: "/signup" },
];

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          flex: 2,
          minWidth: 0,
        }}
        onClick={(item) => {
          navigate(item.key);
        }}
      />
    </Layout>
  );
};
