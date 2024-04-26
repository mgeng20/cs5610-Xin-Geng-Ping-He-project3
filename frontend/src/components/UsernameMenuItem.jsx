import { Drawer, Menu } from "antd";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { axiosInstance } from "../util";

export default () => {
  const [user, setUser] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [requestList, setRequestList] = useState([]);

  const requestListSWR = useSWR(["request-list"], () =>
    axiosInstance.get("/api/passwords/share-requests").then((res) => res.data)
  );

  const showDrawer = () => {
    setDrawerOpen(true);
    setRequestList(JSON.stringify(requestListSWR.data));
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
        <div>{requestList}</div>
      </Drawer>
    </>
  );
};
