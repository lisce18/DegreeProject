import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AcceptOrder = () => {
    const [transactionId, setTransactionId] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setTransactionHash("");

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/seller/acceptOrder",
                {
                    transactionId,
                    deliveryDate,
                }
            );
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setTransactionHash(response.data.transactionHash);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Accept Transaction</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="transactionId">Transaction ID: </label>
                <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                />
                <label htmlFor="deliveryDate">Delivery Date: </label>
                <DatePicker
                    selected={deliveryDate}
                    onChange={(date) => setDeliveryDate(date)}
                    dateFormat="yyyy/MM/dd"
                    required
                />
                <button type="submit">Accept Transaction</button>
            </form>
            {transactionHash && <div>Transaction Hash: {transactionHash}</div>}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default AcceptOrder;
