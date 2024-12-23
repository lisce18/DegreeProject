import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import BuyerPage from "./pages/Buyer";
import SellerPage from "./pages/Seller";
import MediatorPage from "./pages/Mediator";
import CreateTransaction from "./components/CreateTransaction";
import Deposit from "./components/Deposit";
import ConfirmCompletion from "./components/ConfirmCompletion";
import RaiseDispute from "./components/RaiseDispute";
import CancelOrder from "./components/CancelOrder";
import ResolveDispute from "./components/ResolveDispute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "buyer",
                element: <BuyerPage />,
                children: [
                    {
                        path: "createTransaction",
                        element: <CreateTransaction />,
                    },
                    { path: "deposit", element: <Deposit /> },
                    {
                        path: "confirmCompletion",
                        element: <ConfirmCompletion />,
                    },
                    { path: "raiseDispute", element: <RaiseDispute /> },
                    { path: "cancelOrder", element: <CancelOrder /> },
                ],
            },
            {
                path: "seller",
                element: <SellerPage />,
                children: [{ path: "cancelOrder", element: <CancelOrder /> }],
            },
            {
                path: "mediator",
                element: <MediatorPage />,
                children: [
                    { path: "resolveDispute", element: <ResolveDispute /> },
                ],
            },
        ],
    },
]);
