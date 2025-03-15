import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "../signStyle.css";

const SignUp = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.username || !user.email || !user.password) {
      alert("All fields are required!");
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
    alert("Signup successful! Please login");

    navigate("/login"); // Redirect to Login Page
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Sign Up</button>
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
