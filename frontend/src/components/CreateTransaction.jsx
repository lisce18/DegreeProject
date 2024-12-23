import axios from "axios";
import React, { useState } from "react";

const CreateTransaction = () => {
    const [seller, setSeller] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setTransactionId("");

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/buyer/createTransaction",
                { seller }
            );
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setTransactionId(response.data.transactionId.transactionId);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Create Transaction</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="seller">Seller's Address:</label>
                <input
                    type="text"
                    id="seller"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    required
                />
                <button type="submit">Create Transaction</button>
            </form>
            {transactionId && <div>Transaction ID: {transactionId}</div>}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default CreateTransaction;
