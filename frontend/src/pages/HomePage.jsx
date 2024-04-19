import React from "react";
import NavBar from "../components/NavBar";

const HomePage = () => {
  return (
    <>
      <NavBar />
      <div>add product description</div>
    </>
  );
};

export default HomePage;

// function HomePage() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     navigate("/completed-transactions");
//   }, []);

//   return <div />;
// }
