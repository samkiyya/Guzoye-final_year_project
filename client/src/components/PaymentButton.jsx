// src/components/PaymentButton.jsx
import axios from "axios";
/* eslint-disable react/prop-types*/
const PaymentButton = ({
  bookingReference,
  amount,
  email,
  firstName,
  packageName,
}) => {
  const initiatePayment = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/payment/chapa", {
        totalPrice: amount,
        email: email,
        first_name: firstName,
        packageName: packageName,
      });

      if (res.data.success) {
        window.location.href = res.data.checkout_url;
      } else {
        alert("Payment initialization failed");
      }
    } catch (error) {
      console.error("Error initiating payment", error);
      alert("Error initiating payment");
    }
  };

  return <button onClick={initiatePayment}>Pay Now</button>;
};

export default PaymentButton;
