import {
  Badge,
  Button,
  Descriptions,
  Drawer,
  Menu,
  Row,
  Space,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { axiosInstance } from "../util";

export default () => {
  const [user, setUser] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [requestList, setRequestList] = useState([]);
  const [sharedPasswordList, setSharedPasswordList] = useState([]);

  const requestListSWR = useSWR(["request-list"], () =>
    axiosInstance.get("/api/passwords/share-requests").then((res) => res.data)
  );

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

  const removeRequest = (requestId) => {
    axiosInstance
      .delete("/api/passwords/share-request/" + requestId)
      .then(() => {
        requestListSWR.mutate();
        message.success("Request removed");
      });
  };
  const acceptRequest = (requestId) => {
    axiosInstance
      .put(`/api/passwords/share-request/${requestId}/accept`)
      .then(() => {
        requestListSWR.mutate();
        message.success("Request accepted");
        mutate("getSharedPasswords");
      });
  };
  const requestList = requestListSWR.data ?? [];

  return (
    <>
      <Space>
        <Badge count={requestListSWR.data ? requestListSWR.data.length : 0}>
          <Menu.Item onClick={() => setDrawerOpen(true)}>
            Hello, {user?.username}
          </Menu.Item>
        </Badge>
        <Drawer
          title="Share Requests"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          <Descriptions column={1}>
            {requestList.map((item) => (
              <React.Fragment>
                <Descriptions.Item label="Sender">
                  {item.sender.username}
                </Descriptions.Item>
                <Descriptions.Item label="Service">
                  {item.password.service}
                </Descriptions.Item>
                <Descriptions.Item>
                  <Row style={{ gap: 10 }}>
                    <Button
                      type="primary"
                      onClick={() => acceptRequest(item["_id"])}
                    >
                      Accept
                    </Button>
                    <Button onClick={() => removeRequest(item["_id"])}>
                      Ignore
                    </Button>
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
