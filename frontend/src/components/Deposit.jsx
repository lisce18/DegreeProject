import axios from "axios";
import React, { useState } from "react";

const Deposit = () => {
    const [transactionId, setTransactionId] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setTransactionHash("");

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/buyer/deposit",
                { transactionId, amount }
            );
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setTransactionHash(response.data.transactionHash);
            }
            console.log(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Deposit</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="transactionId">Transaction ID:</label>
                <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                />
                <label htmlFor="amount">Amount:</label>
                <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <button type="submit">Deposit</button>
            </form>
            {transactionHash && <div>Transaction Hash: {transactionHash}</div>}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default Deposit;
