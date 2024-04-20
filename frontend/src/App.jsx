import { ConfigProvider } from "antd";
import { RouterProvider, createHashRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PasswordManagerPage from "./pages/PasswordManagerPage";
import SignUpPage from "./pages/SignUpPage";

const router = createHashRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/password-manager", element: <PasswordManagerPage /> },
]);

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00b96b",
          borderRadius: 5,
        },
        components: {
          Menu: {
            darkItemBg: "#00b96b",
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
