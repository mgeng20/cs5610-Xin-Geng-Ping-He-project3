import { Drawer, Menu } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../util";

export default () => {
  const [user, setUser] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showDrawer = () => {
    setDrawerOpen(true);
  };
  const onClose = () => {
    setDrawerOpen(false);
  };

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
  // get message list
  return (
    <>
      <Menu.Item onClick={showDrawer}>Hello, {user?.username} </Menu.Item>
      <Drawer title="Messages" onClose={onClose} open={drawerOpen}>
        <p>Empty...</p>
      </Drawer>
    </>
  );
};
