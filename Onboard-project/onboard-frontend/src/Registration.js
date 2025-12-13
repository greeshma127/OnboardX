import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
import bg1 from "./bg1.png";

function Registration({ onSuccess }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/customers", formData);
      const savedUser = res.data.customer;
      alert("Registration successful!");
      onSuccess(savedUser);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  };

  return (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    
    {/* LEFT WHITE SECTION */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      {/* Top-left heading */}
      <h1 id="head" style={{ margin: 0 }}>OnboardX</h1>

      {/* Centered registration form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 400, width: "100%" }}>
          <h2 id="head2">Register</h2>

          <form onSubmit={handleSubmit}>
            <label>Name:</label><br></br>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "80%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
            /><br></br>

            <label>Email:</label><br></br>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "80%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
            /><br></br>

            <label>Phone Number:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ width: "80%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "80%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
            />

            <button
              type="submit"
              id="btn"
              style={{
                width: "83%",
                padding: 10,
                background: "black",
                color: "white",
                border: "none",
                borderRadius: 5,
                marginTop: 10,
                fontSize: "17px",
              }}
            >
              Register
            </button>
          </form>
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

export default Registration;
