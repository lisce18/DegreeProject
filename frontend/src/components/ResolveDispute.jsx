import axios from "axios";
import React, { useState } from "react";

const ResolveDispute = () => {
    const [transactionId, setTransactionId] = useState("");
    const [releaseFundsToPartyB, setReleaseFundsToPartyB] = useState(false);
    const [transactionHash, setTransactionHash] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setTransactionHash("");

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/mediator/resolveDispute",
                { transactionId, releaseFundsToPartyB }
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
            <h1>Resolve Dispute</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="transactionId">Transaction ID:</label>
                <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                />
                <label htmlFor="releaseFundsToPartyB">
                    Release Funds to Party B:
                </label>
                <input
                    type="checkbox"
                    id="releaseFundsToPartyB"
                    checked={releaseFundsToPartyB}
                    onChange={(e) => setReleaseFundsToPartyB(e.target.checked)}
                />
                <button type="submit">Resolve Dispute</button>
            </form>
            {transactionHash && <div>Transaction Hash: {transactionHash}</div>}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default ResolveDispute;
