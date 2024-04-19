import { Button, Checkbox, Form, Input, InputNumber, Space, Table } from "antd";
import React from "react";
import NavBar from "../components/NavBar";
import passwordListColumnConfig from "../passwordListColumnConfig";

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
  const onFinish = (values) => {
    console.log("Success:", values);
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
          maxWidth: 480,
          margin: "auto",
          paddingTop: 60,
        }}
        initialValues={{
          alphabet: false,
          numerals: false,
          symbols: false,
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Form.Item name="alphabet" valuePropName="alphabet">
              <Checkbox>Alphabet</Checkbox>
            </Form.Item>

            <Form.Item name="numerals" valuePropName="numerals">
              <Checkbox>Numerals</Checkbox>
            </Form.Item>

            <Form.Item name="symbols" valuePropName="symbols">
              <Checkbox>Symbols</Checkbox>
            </Form.Item>
            <Form.Item label="Length" name="length">
              <InputNumber min={4} max={50} />
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
          style={{ margin: 20 }}
          columns={passwordListColumnConfig}
          dataSource={data}
        />
      </div>
    </>
  );
};

export default PasswordManagerPage;
