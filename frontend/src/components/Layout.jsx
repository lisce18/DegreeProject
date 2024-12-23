import { Outlet, NavLink } from "react-router-dom";
import React from "react";

const Layout = () => {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <NavLink to={"/buyer"}>Buyer</NavLink>
                        </li>
                        <li>
                            <NavLink to={"/seller"}>Seller</NavLink>
                        </li>
                        <li>
                            <NavLink to={"/mediator"}>Mediator</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer></footer>
        </div>
    );
};

export default Layout;
