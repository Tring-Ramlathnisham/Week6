import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import "../styles/signStyle.css";

const SIGNUP_USER = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      email
    }
  }
`;

const SignUp = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [signup] = useMutation(SIGNUP_USER);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup({ variables: user });
      if (data?.signup?.email) {
        alert("Signup successful! You can now log in.");
        navigate("/login");
      } else {
        alert("Signup failed. Try again.");
      }
    } catch (error) {
      alert("Error signing up. Email may already exist.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="sign-button" type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/login">
          <span>Login</span>
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
