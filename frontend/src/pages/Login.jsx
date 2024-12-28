import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/auth/login",
                {
                    username,
                    password,
                }
            );

            const { token, role } = response.data;
            localStorage.setItem("token", token);

            if (role === "buyer") {
                navigate("/buyer");
            } else if (role === "seller") {
                navigate("/seller");
            } else if (role === "admin") {
                navigate("/admin");
            } else if (role === "mediator") {
                navigate("/mediator");
            }
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <div>{error}</div>}
        </div>
    );
};

export default Login;
