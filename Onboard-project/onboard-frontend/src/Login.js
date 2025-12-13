import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import bg1 from "./bg1.png";


function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return alert("Email and password required");

    await onLogin(formData);
    navigate("/dashboard"); // redirect after login
  };

  return (
    <div class="div" style={{ display: "flex", minHeight: "100vh" }}>
  
  {/* LEFT WHITE SECTION */}
  <div class="div1"
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "20px",
    }}
  >
    {/* Top-left heading */}
    <h1 id="head" style={{ margin: 0 }}>OnboardX</h1>

    {/* Centered login container */}
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: 400, width: "100%" }}>
        <h2 id="head2">Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "80%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "80%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
          />

          <button
          id="btn"
            type="submit"
            style={{
              width: "83%",
              padding: 10,
              background: "black",
              color: "white",
              border: "none",
              marginTop: 10,
              borderRadius:5,
              fontSize:"17px"
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: 10 }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  </div>

  {/* RIGHT GRADIENT SECTION */}
  <div
  id="gradient"
    style={{
      width: "700px",
    }}>
      <img
      id="img"
    src={bg1}
    alt="background"
    style={{
      width: "450px",
      height: "auto",
      objectFit: "contain",
      margin:120
    }}
  />
    </div>
</div>

  );
}

export default Login;
