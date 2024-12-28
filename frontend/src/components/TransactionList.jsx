import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionList = ({ role }) => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:3000/api/v1/transactions",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTransactions(response.data);
            } catch (err) {
                setError(err.response.data.error);
            }
        };

        fetchTransactions();
    }, []);

    const handleAction = async (transactionId, action) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:3000/api/v1/${role}/${action}`,
                { transactionId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(`Transaction ${action} successfully!`);
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    return (
        <div>
            <h2>Transactions</h2>
            {error && <div>{error}</div>}
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction._id}>
                        {transaction.transactionId} - {transaction.state}
                        {role === "buyer" &&
                            transaction.state === "CREATED" && (
                                <button
                                    onClick={() =>
                                        handleAction(transaction._id, "deposit")
                                    }
                                >
                                    Deposit
                                </button>
                            )}
                        {role === "buyer" &&
                            transaction.state === "DEPOSITED" && (
                                <button
                                    onClick={() =>
                                        handleAction(
                                            transaction._id,
                                            "confirmCompletion"
                                        )
                                    }
                                >
                                    Confirm Completion
                                </button>
                            )}
                        {role === "seller" &&
                            transaction.state === "CREATED" && (
                                <button
                                    onClick={() =>
                                        handleAction(
                                            transaction._id,
                                            "acceptOrder"
                                        )
                                    }
                                >
                                    Accept
                                </button>
                            )}
                        {role === "seller" &&
                            transaction.state === "ACCEPTED" && (
                                <button
                                    onClick={() =>
                                        handleAction(
                                            transaction._id,
                                            "prepareShipment"
                                        )
                                    }
                                >
                                    Prepare Shipment
                                </button>
                            )}
                        {role === "mediator" &&
                            transaction.state === "DISPUTED" && (
                                <button
                                    onClick={() =>
                                        handleAction(
                                            transaction._id,
                                            "resolveDispute"
                                        )
                                    }
                                >
                                    Resolve Dispute
                                </button>
                            )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
