import React from "react";
import TransactionList from "../components/TransactionList";

const BuyerPage = () => {
    return (
        <div>
            <h1>Buyer Dashboard</h1>
            <TransactionList role="buyer" />
        </div>
    );
};

export default BuyerPage;
