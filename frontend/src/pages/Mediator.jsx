import React from "react";
import CreateCompany from "../components/CreateCompany";
import CompanyList from "../components/CompanyList";

const MediatorPage = () => {
    return (
        <div>
            <h1>Mediator Dashboard</h1>
            <CreateCompany />
            <CompanyList />
        </div>
    );
};

export default MediatorPage;
