import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { axiosInstance } from "../util";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [messageApi, messageHolder] = message.useMessage();
  const navigate = useNavigate();

  function setUsername(event) {
    const username = event.target.value;
    setUsernameInput(username);
  }

  function setPassword(event) {
    const pswd = event.target.value;
    setPasswordInput(pswd);
  }

  async function handleLogin() {
    try {
      const res = await axiosInstance.post("/api/auth/login", {
        username: usernameInput,
        password: passwordInput,
      });
      const { access_token } = res.data;
      sessionStorage.setItem("access_token", access_token);
      // Assuming the server responds with a success message
      messageApi.success("Login successful");
      // Redirect to dashboard or home page
      navigate("/password-manager"); // Adjust the route as per your application
    } catch (error) {
      // Handle errors such as incorrect credentials
      messageApi.error(
        "Login failed. Please check your credentials.",
        error.response.data
      );
    }
  }

  return (
    <>
      <NavBar />
      {messageHolder}
      <Form
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 480,
          margin: "auto",
          paddingTop: 200,
        }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h1>Log in</h1>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username.",
            },
          ]}
        >
          <Input value={usernameInput} onChange={setUsername} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password.",
            },
          ]}
        >
          <Input.Password value={passwordInput} onChange={setPassword} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 16,
          }}
        >
          <Button
            style={{
              width: "100%",
            }}
            type="primary"
            htmlType="submit"
            onClick={handleLogin}
          >
            Login
          </Button>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </Form.Item>
      </Form>
    </>
  );
};
export default LoginPage;
