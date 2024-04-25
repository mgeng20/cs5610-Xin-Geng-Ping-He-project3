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
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
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

const CreateNewPassword = () => {
  const { trigger, isMutating } = useSWRMutation(
    ["password-list"],
    (key, { arg }) => axiosInstance.post("/api/passwords/", arg)
  );

  const onFinish = (values) => {
    trigger(values)
      .then(() => message.success("Password saved successfully"))
      .catch((error) =>
        message.error(
          "Failed to save the password: " +
            (error.response.data.message || "Unknown Error")
        )
      );
  };

  return (
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
          <Button type="primary" htmlType="submit" isLoading={isMutating}>
            Submit
          </Button>
          <Button htmlType="reset">Clear</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const PasswordTable = () => {
  const { data, isLoading } = useSWR(["password-list"], () =>
    axiosInstance.get("/api/passwords").then((res) => res.data)
  );
  return (
    <Table
      isLoading={isLoading}
      style={{ margin: 20, marginTop: 60 }}
      columns={passwordListColumnConfig}
      dataSource={data}
    />
  );
};

const PasswordManagerPage = () => {
  return (
    <>
      <NavBar />
      <CreateNewPassword />
      <PasswordTable />
    </>
  );
};

export default PasswordManagerPage;
