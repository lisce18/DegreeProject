import axios from "axios";
import React, { useState } from "react";

const ConfirmCompletion = () => {
    const [transactionId, setTransactionId] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setTransactionHash("");

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/buyer/confirmCompletion",
                { transactionId }
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
            <h1>Confirm Completion</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="transactionId">Transaction ID:</label>
                <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                />
                <button type="submit">Confirm Completion</button>
            </form>
            {transactionHash && <div>Transaction Hash: {transactionHash}</div>}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default ConfirmCompletion;
