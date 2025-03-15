import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <>
    <nav className="navbar">
      {/* Company Logo */}
      <div className="logo">
        <img src="/tringapps-copy-2.png" alt="Tringapps-logo"/>
      </div>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <Link to="/login">
          <button className="nav-btn">Sign In</button>
        </Link>
        <Link to="/signup">
          <button className="nav-btn signup-btn">Sign Up</button>
        </Link>
      </div>
    </nav>
    <h1>Welcome to Home page</h1>
    </>
  );
};

export default Home;
