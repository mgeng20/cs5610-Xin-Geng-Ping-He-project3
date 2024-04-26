import { Badge, Button, Descriptions, Drawer, Menu, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
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

    const lst = Object.values(requestListSWR.data).map((item) => [
      item.user.username,
      item.service,
    ]);
    setRequestList(lst);
    console.log(requestListSWR.data);
    console.log(requestList);
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
      <Space>
        <Badge count={requestListSWR.data ? requestListSWR.data.length : 0}>
          <Menu.Item onClick={showDrawer}>Hello, {user?.username} </Menu.Item>
        </Badge>
        <Drawer title="Share Requests" onClose={onClose} open={drawerOpen}>
          <Descriptions column={1}>
            {requestList.map((item, index) => (
              <React.Fragment>
                <Descriptions.Item label="User">{item[0]}</Descriptions.Item>
                <Descriptions.Item label="Service">{item[1]}</Descriptions.Item>
                <Descriptions.Item>
                  <Row style={{ gap: 10 }}>
                    <Button type="primary">Accept</Button>
                    <Button>Ignore</Button>
                  </Row>
                </Descriptions.Item>
              </React.Fragment>
            ))}
          </Descriptions>
        </Drawer>
      </Space>
    </>
  );
};
