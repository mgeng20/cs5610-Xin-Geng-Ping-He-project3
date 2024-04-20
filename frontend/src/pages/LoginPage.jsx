import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const onFinish = (values) => {
  console.log("Success:", values);
};
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

  return (
    <>
      <NavBar />

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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default LoginPage;

// type FormDataType = {
//   email?: string;
//   password?: string;
// };

// function LoginPage() {
//   const [messageApi, messageHolder] = message.useMessage();
//   const navigate = useNavigate();

//   return (
//     <div>
//       {messageHolder}
//       <Form<FormDataType>
//         name="basic"
//         labelCol={{ span: 6 }}
//         wrapperCol={{ span: 14 }}
//         className="login-form"
// onFinish={(formData) => {
//   const { email, password } = formData;

//   apiServer
//     .post("/login", { email, password })
//     .then((res) => {
//       const { access_token } = res.data;
//       sessionStorage.setItem("access_token", access_token);
//       messageApi.success("Login success");
//       navigate("/process-payment");
//     })
//     .catch((err: AxiosError) => {
//       if (err.response?.status == 401) {
//         messageApi.error("Login failed");
//         return;
//       }
//       messageApi.error(err.message);
//     });
// }}
//       >
//         <div style={{ textAlign: "center", marginBottom: 20 }}>
//           {/* <img src={logo} alt="Logo" width={564} height={134} /> */}
//         </div>
//         <Form.Item<FormDataType>
//           label="Email"
//           name="email"
//           rules={[{ required: true, message: "Please input your email!" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item<FormDataType>
//           label="Password"
//           name="password"
//           rules={[{ required: true, message: "Please input your password!" }]}
//         >
//           <Input.Password />
//         </Form.Item>

//         <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
//           <Button type="primary" htmlType="submit">
//             Login
//           </Button>
//           &nbsp;&nbsp;&nbsp;
//           <Link to={"/signup"}>
//             <Button>Sign up</Button>
//           </Link>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// }

// export default LoginPage;
