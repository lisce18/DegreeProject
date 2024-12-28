import { createBrowserRouter } from "react-router-dom";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import BuyerPage from "./pages/BuyerPage";
import SellerPage from "./pages/SellerPage";
import AdminPage from "./pages/AdminPage";
import MediatorPage from "./pages/MediatorPage";
import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: "buyer",
        element: (
            <PrivateRoute>
                <BuyerPage />
            </PrivateRoute>
        ),
    },
    {
        path: "seller",
        element: (
            <PrivateRoute>
                <SellerPage />
            </PrivateRoute>
        ),
    },
    {
        path: "admin",
        element: (
            <PrivateRoute>
                <AdminPage />
            </PrivateRoute>
        ),
    },
    {
        path: "mediator",
        element: (
            <PrivateRoute>
                <MediatorPage />
            </PrivateRoute>
        ),
    },
]);
