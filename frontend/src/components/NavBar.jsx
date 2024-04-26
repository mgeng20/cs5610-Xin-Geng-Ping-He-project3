import { Layout, Menu } from "antd";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UsernameMenuItem from "./UsernameMenuItem";

export default () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = sessionStorage.getItem("access_token") !== null;

  const { pathname } = location;

  return (
    <Layout>
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[pathname]}
        style={{
          flex: 2,
          minWidth: 0,
          fontSize: 18,
        }}
      >
        <Menu.Item key="/">
          <Link to="/">Home </Link>
        </Menu.Item>

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
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>

            <Menu.Item key="/signup">
              <Link to="/signup">Signup</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Layout>
  );
};
