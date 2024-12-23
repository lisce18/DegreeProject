import axios from "axios";
import React from "react";

const TransactionDetails = () => {
    const [transactionId, setTransactionId] = useState("");
    const [transaction, setTransaction] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        setError("");
        setTransaction(null);

        try {
            const response = await axios.get(
                `http://localhost:3000/api/v1/${trasnactionId}`
            );
            setTransaction(response.data.transaction);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Transaction Details</h1>
            <form onSubmit={handleSearch}>
                <label htmlFor="transactionId">Transaction ID:</label>
                <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>
            {transaction && (
                <div>
                    <h2>Transaction Information</h2>
                    <p>Transaction ID: {transaction.transactionId}</p>
                    <p>Buyer: {transaction.buyer}</p>
                    <p>Seller: {transaction.seller}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>State: {transaction.state}</p>
                    <p>Delivery Date: {transaction.deliveryDate}</p>
                    {/* Add buttons for actions based on the state */}
                </div>
            )}
            {error && <div>Error: {error}</div>}
        </div>
    );
};

export default TransactionDetails;
