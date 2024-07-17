// src/components/ReturnPage.jsx
import { useLocation } from "react-router-dom";

const ReturnPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const status = query.get("status");
  const txRef = query.get("tx_ref");

  return (
    <div>
      <h1>Payment {status === "success" ? "Successful" : "Failed"}</h1>
      <p>Transaction Reference: {txRef}</p>
    </div>
  );
};

export default ReturnPage;
