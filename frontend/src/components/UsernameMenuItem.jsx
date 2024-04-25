import { Menu } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../util";

export default () => {
  const [user, setUser] = useState();

  useEffect(() => {
    axiosInstance
      .get("/api/account/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return <Menu.Item>Hello, {user?.username} </Menu.Item>;
};
