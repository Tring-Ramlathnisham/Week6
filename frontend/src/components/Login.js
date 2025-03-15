import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import "../styles/signStyle.css";

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = ({ setAuthToken }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [login, { loading, error }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: credentials });

      if (data?.login?.token) {
        setAuthToken(data.login.token); // Save token in React state
        navigate("/persona"); // Redirect to persona page
      } else {
        alert("Invalid credentials! Please try again.");
      }
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="sign-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p className="error-message">Invalid email or password.</p>}
      <p>
        Don't have an account?{" "}
        <Link to="/signup">
          <span>Sign Up</span>
        </Link>
      </p>
    </div>
  );
};

export default Login;
