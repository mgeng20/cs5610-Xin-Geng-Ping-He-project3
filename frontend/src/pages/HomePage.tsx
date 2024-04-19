import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/completed-transactions");
  }, []);

  return <div />;
}

export default HomePage;
