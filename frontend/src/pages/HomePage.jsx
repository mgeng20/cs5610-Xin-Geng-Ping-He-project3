import { Button, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <NavBar />
      <div className="homepage-container">
        <div className="description">Welcome to your password manager!</div>
        <Row style={{ gap: 36, marginTop: 20 }}>
          <Button
            type="primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
          <Button
            type="primary"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Signup
          </Button>
        </Row>
      </div>
    </>
  );
};

export default HomePage;
