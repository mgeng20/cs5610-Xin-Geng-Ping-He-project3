import { Layout, Menu, theme } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const isLoggedIn = sessionStorage.getItem("access_token") !== null;
  const menuItems = _.compact([
    { label: "Home", key: "/" },
    !isLoggedIn && { label: "Login", key: "/login" },
    !isLoggedIn && { label: "Signup", key: "/signup" },
    isLoggedIn && { label: username, key: "/logout" },
  ]);

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
