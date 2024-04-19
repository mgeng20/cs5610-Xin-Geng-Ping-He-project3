import { Button, Form, Input, message } from "antd";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiServer } from "../util";

type FormDataType = {
  name?: string;
  email?: string;
  password?: string;
};

type ErrorResponse = {
  detail: string;
};

function SignUpPage() {
  const [messageApi, messageHolder] = message.useMessage();
  const navigate = useNavigate();
  return (
    <div>
      {messageHolder}
      <Form<FormDataType>
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        className="login-form"
        onFinish={(formData) => {
          const { name, email, password } = formData;

          apiServer
            .post("/signup", { name, email, password })
            .then((res) => {
              messageApi.success("Your account has been successfully created.");
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            })
            .catch((err: AxiosError<ErrorResponse>) => {
              if (err.response) {
                messageApi.error(err.response.data.detail);
              } else {
                messageApi.error("Network Error");
              }
            });
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src={logo} alt="Logo" width={564} height={134} />
        </div>
        <Form.Item<FormDataType>
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FormDataType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FormDataType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            Create a new account
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Link to={"/login"}>
            <Button>Back to Login</Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUpPage;
