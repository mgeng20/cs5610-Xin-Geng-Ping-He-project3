import { Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UsernameMenuItem from "./UsernameMenuItem";

const { Header } = Layout;

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const isLoggedIn = sessionStorage.getItem("access_token") !== null;
  // const menuItems = _.compact([
  //   { label: "Home", key: "/" },
  //   !isLoggedIn && { label: "Login", key: "/login" },
  //   !isLoggedIn && { label: "Signup", key: "/signup" },
  //   isLoggedIn && { label: username, key: "/logout" },
  // ]);

  return (
    <Layout>
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{
          flex: 2,
          minWidth: 0,
        }}
      >
        <Link to="/">
          <Menu.Item>Home</Menu.Item>
        </Link>
        <div style={{ flex: 1 }}></div>
        {isLoggedIn ? (
          <>
            <UsernameMenuItem />
            <Menu.Item
              onClick={() => {
                sessionStorage.clear("access_token");
                navigate("/");
              }}
            >
              Log out
            </Menu.Item>
          </>
        ) : (
          <>
            <Link to="/login">
              <Menu.Item>Login</Menu.Item>
            </Link>
            <Link to="/signup">
              <Menu.Item>Signup</Menu.Item>
            </Link>
          </>
        )}
      </Menu>
    </Layout>
  );
};
