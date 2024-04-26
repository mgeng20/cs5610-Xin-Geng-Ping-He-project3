import { CopyOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Row, message } from "antd";
import { useState } from "react";

export default ({ password }) => {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <Row style={{ gap: 8 }}>
      <div style={{ width: 100 }}>{isHidden ? "***********" : password}</div>
      <EyeInvisibleOutlined onClick={() => setIsHidden((prev) => !prev)} />
      <CopyOutlined
        onClick={() => {
          navigator.clipboard.writeText(password);
          message.success("Password copied");
        }}
      />
    </Row>
  );
};
