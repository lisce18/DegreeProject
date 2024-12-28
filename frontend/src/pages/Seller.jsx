import React from "react";
import TransactionList from "../components/TransactionList";

const SellerPage = () => {
    return (
        <div>
            <h1>Seller Dashboard</h1>
            <TransactionList role="seller" />
        </div>
    );
};

export default SellerPage;
