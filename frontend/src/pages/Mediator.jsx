import React from "react";
import { Link, Outlet } from "react-router-dom";
import ResolveDispute from "../components/ResolveDispute";

const Mediator = () => {
    return (
        <div>
            <h1>Mediator Page</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/mediator/resolveDispute">
                            Resolve Dispute
                        </Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
};

export default Mediator;
