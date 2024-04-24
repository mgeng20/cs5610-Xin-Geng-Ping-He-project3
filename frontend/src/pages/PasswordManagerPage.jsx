import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Space,
  Table,
  message,
} from "antd";
import React from "react";
import NavBar from "../components/NavBar";
import passwordListColumnConfig from "../passwordListColumnConfig";
import { axiosInstance } from "../util";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const data = [
  {
    service: "youtube",
    password: "123456",
    lastUpdated: new Date().toLocaleDateString(),
  },
];

const PasswordManagerPage = () => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const token = sessionStorage.getItem("access_token");
    console.log("Token sent in request:", token); // Check if the token looks correct
    if (!token) {
      message.error("You must be logged in to save a password.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/api/passwords/",
        {
          service: values.service,
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure this format is correct
          },
        }
      );
      console.log("Server response:", response.data);
      message.success("Password saved successfully");
    } catch (error) {
      console.error("Failed to create password:", error.response);
      message.error(
        "Failed to save the password: " +
          (error.response.data.message || "Unknown Error")
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <NavBar />
      <Form
        {...layout}
        name="basic"
        style={{
          maxWidth: 600,
          margin: "auto",
          paddingTop: 60,
        }}
        initialValues={{
          alphabet: true,
          numbers: true,
          symbols: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Service or URL"
          name="service"
          rules={[
            {
              required: true,
              message: "Please input the service.",
            },
          ]}
        >
          <Input placeholder="Enter service name or website url" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password.",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your password or system will generate one"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Form.Item name="alphabet" valuePropName="checked">
              <Checkbox>Alphabet</Checkbox>
            </Form.Item>

            <Form.Item name="numbers" valuePropName="checked">
              <Checkbox>Numbers</Checkbox>
            </Form.Item>
            <Form.Item name="symbols" valuePropName="checked">
              <Checkbox>Symbols</Checkbox>
            </Form.Item>
            <Form.Item label="Length" name="length">
              <InputNumber
                min={4}
                max={50}
                defaultValue={12}
                style={{
                  width: 56,
                }}
              />
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="reset">Clear</Button>
          </Space>
        </Form.Item>
      </Form>
      <div>
        <Table
          style={{ margin: 20, marginTop: 60 }}
          columns={passwordListColumnConfig}
          dataSource={data}
        />
      </div>
    </>
  );
};

export default PasswordManagerPage;
