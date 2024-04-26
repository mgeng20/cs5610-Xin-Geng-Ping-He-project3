import { Input, Modal } from "antd";
import React, { useState } from "react";

export default () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title="update password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input>new password</Input>
      </Modal>
    </>
  );
};
