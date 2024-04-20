import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
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
