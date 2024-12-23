import React from "react";
import { Link, Outlet } from "react-router-dom";
import CancelOrder from "../components/CancelOrder";

const Seller = () => {
    return (
        <div>
            <h1>Seller Page</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/seller/cancelOrder">Cancel Order</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
};

export default Seller;
