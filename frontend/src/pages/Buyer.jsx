import React from "react";
import { Link, Outlet } from "react-router-dom";
import CreateTransaction from "../components/CreateTransaction";
import Deposit from "../components/Deposit";
import ConfirmCompletion from "../components/ConfirmCompletion";
import RaiseDispute from "../components/RaiseDispute";
import CancelOrder from "../components/CancelOrder";

const Buyer = () => {
    return (
        <div>
            <h1>Buyer Page</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/buyer/createTransaction">
                            Create Transaction
                        </Link>
                    </li>
                    <li>
                        <Link to="/buyer/deposit">Deposit</Link>
                    </li>
                    <li>
                        <Link to="/buyer/confirmCompletion">
                            Confirm Completion
                        </Link>
                    </li>
                    <li>
                        <Link to="/buyer/raiseDispute">Raise Dispute</Link>
                    </li>
                    <li>
                        <Link to="/buyer/cancelOrder">Cancel Order</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
};

export default Buyer;
