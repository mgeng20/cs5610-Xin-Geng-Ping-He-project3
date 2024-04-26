import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Table,
  message,
} from "antd";
import React, { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import NavBar from "../components/NavBar";
import SharedPasswordList from "../components/SharedPasswordList";
import { generateColumnConfig } from "../passwordListColumnConfig";
import { axiosInstance, clearPasswordListCache } from "../util";

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
    (key, { arg }) => axiosInstance.post("/api/passwords/", arg),
    {
      onSuccess: clearPasswordListCache,
    }
  );

  const onFinish = (values) => {
    const { service, password, alphabet, numerals, symbols, length } = values;

    if (!password) {
      if (!alphabet && !numerals && !symbols) {
        message.error("At least one character set must be selected");
        return;
      }
      if (length < 4 || length > 50) {
        message.error("Password length must be between 4 and 50");
        return;
      }
      axiosInstance
        .post("/api/passwords/generate", {
          service,
          alphabet,
          numerals,
          symbols,
          length,
        })
        .then((res) => {
          message.success("Password saved successfully");
          clearPasswordListCache();
        })
        .catch((error) =>
          message.error(
            "Failed to save the password: " +
              (error.response.data.message || "Unknown Error")
          )
        );
    } else {
      trigger({ service, password })
        .then(() => message.success("Password saved successfully"))
        .catch((error) =>
          message.error(
            "Failed to save the password: " +
              (error.response.data.message || "Unknown Error")
          )
        );
    }
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

      <Form.Item label="Password" name="password">
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
  const [keyword, setKeyword] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingRecord, setUpdatingRecord] = useState();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUsername, setShareUsername] = useState("");
  const [passwordToShare, setPasswordToShare] = useState(null);

  const passwordListSWR = useSWR(["password-list", keyword], () =>
    axiosInstance
      .get("/api/passwords?keyword=" + keyword)
      .then((res) => res.data)
  );

  function setNewPassword(event) {
    const newPassword = event.target.value;
    setNewPasswordInput(newPassword);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    axiosInstance
      .put("/api/passwords/" + updatingRecord["_id"], {
        password: newPasswordInput,
      })
      .then(() => {
        message.success("Password updated");
        setIsModalOpen(false);
        clearPasswordListCache();
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onClickUpdate = (record) => {
    showModal();
    setUpdatingRecord(record);
  };
  const onClickDelete = (record) => {
    axiosInstance.delete("/api/passwords/" + record["_id"]).then(() => {
      message.success("Password deleted");
      clearPasswordListCache();
    });
  };
  const showShareModal = (record) => {
    setIsShareModalOpen(true);
    setPasswordToShare(record);
  };

  const handleShareSubmit = () => {
    axiosInstance
      .post("/api/passwords/share", {
        sharedWith: shareUsername,
        passwordId: passwordToShare._id,
      })
      .then(() => {
        message.success("Password shared successfully");
        setIsShareModalOpen(false);
        setShareUsername("");
        setPasswordToShare(null);
      })
      .catch((error) => {
        message.error(
          "Failed to share password: " + error.response.data.message
        );
      });
  };

  return (
    <>
      <Row style={{ paddingLeft: 20 }}>
        <Input
          addonBefore={<SearchOutlined />}
          placeholder="Search the service or URL here"
          style={{ width: 400 }}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Row>

      <Table
        isLoading={passwordListSWR.isLoading}
        style={{ margin: 20, marginTop: 20 }}
        columns={generateColumnConfig(
          onClickUpdate,
          onClickDelete,
          showShareModal
        )}
        dataSource={passwordListSWR.data}
      />
      <Modal
        title="Update password"
        open={isModalOpen}
        onOk={handleOk}
        okText={"Submit"}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Enter the new password here"
          onChange={(e) => setNewPasswordInput(e.target.value)}
        ></Input>
      </Modal>
      <Modal
        title="Share Password"
        open={isShareModalOpen}
        onOk={handleShareSubmit}
        onCancel={() => setIsShareModalOpen(false)}
      >
        <Input
          placeholder="Enter username to share with"
          value={shareUsername}
          onChange={(e) => setShareUsername(e.target.value)}
        />
      </Modal>
    </>
  );
};

const PasswordManagerPage = () => {
  const [sharedPasswords, setSharedPasswords] = useState([]);
  const [shareRequests, setShareRequests] = useState([]);
  const [receivedShareRequests, setReceivedShareRequests] = useState([]);

  // useEffect(() => {
  //   // fetchSharedPasswords();
  //   // fetchShareRequests();

  //   const intervalId = setInterval(() => {
  //     fetchReceivedShareRequests();
  //   }, 5000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  // const fetchSharedPasswords = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/passwords/shared");
  //     setSharedPasswords(response.data);
  //   } catch (error) {
  //     console.error("Error fetching shared passwords:", error);
  //   }
  // };

  // const fetchShareRequests = async () => {
  //   try {
  //     const response = await axiosInstance.get("/api/passwords/share-requests");
  //     setShareRequests(response.data);
  //   } catch (error) {
  //     console.error("Error fetching share requests:", error);
  //   }
  // };

  // const fetchReceivedShareRequests = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       "/api/passwords/received-share-requests"
  //     );
  //     setReceivedShareRequests(response.data);
  //   } catch (error) {
  //     console.error("Error fetching received share requests:", error);
  //   }
  // };

  // const handleAcceptShareRequest = async (passwordId, requestId) => {
  //   try {
  //     await axiosInstance.put(
  //       `/api/passwords/${passwordId}/share-requests/${requestId}`,
  //       { accepted: true }
  //     );
  //     message.success("Share request accepted");
  //     fetchSharedPasswords();
  //     fetchShareRequests();
  //     fetchReceivedShareRequests();
  //   } catch (error) {
  //     message.error("Failed to accept share request");
  //   }
  // };

  // const handleRejectShareRequest = async (passwordId, requestId) => {
  //   try {
  //     await axiosInstance.put(
  //       `/api/passwords/${passwordId}/share-requests/${requestId}`,
  //       { accepted: false }
  //     );
  //     message.success("Share request rejected");
  //     fetchShareRequests();
  //     fetchReceivedShareRequests();
  //   } catch (error) {
  //     message.error("Failed to reject share request");
  //   }
  // };

  return (
    <>
      <NavBar />
      <CreateNewPassword />
      <PasswordTable />
      {/* <div>
        <h2>Password Share Requests</h2>
        {shareRequests.length > 0 ? (
          shareRequests.map((password) => (
            <div key={password._id}>
              {password.shareRequests.map((request) => (
                <div key={request._id}>
                  <p>
                    {request.sender.username} wants to share a password with
                    you.
                  </p>
                  <button
                    onClick={() =>
                      handleAcceptShareRequest(password._id, request._id)
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleRejectShareRequest(password._id, request._id)
                    }
                  >
                    Reject
                  </button>
                </div>
              ))}
            </div>
          ))
        ) : (
          <Empty description="No password share requests yet." />
        )}
      </div> */}

      {/* <h2>Received Password Share Requests</h2> */}
      {/* {receivedShareRequests.length > 0 ? (
          receivedShareRequests.map((request) => (
            <div key={request._id}>
              <p>
                {request.sender.username} wants to share the password for{" "}
                {request.password.service} with you.
              </p>
              {/* <button
                onClick={() =>
                  handleAcceptShareRequest(request.password._id, request._id)
                }
              >
                Accept
              </button>
              <button
                onClick={() =>
                  handleRejectShareRequest(request.password._id, request._id)
                }
              >
                Reject
              </button> */}

      {/* ))
        ) : (
          <Empty description="No received password share requests yet." />
        )} */}

      <SharedPasswordList passwords={sharedPasswords} />
    </>
  );
};

export default PasswordManagerPage;
