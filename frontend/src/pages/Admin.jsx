import React from "react";
import AddUser from "../components/AddUser";
import UserList from "../components/UserList";

const AdminPage = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <AddUser />
            <UserList />
        </div>
    );
};

export default AdminPage;
