import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import bg1 from "./bg1.png";

function Registration({ onSuccess }) {
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    gstin: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );

      const savedUser = res.data.user;
      alert("Registration successful!");
      onSuccess(savedUser);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="div4">
      <div className="div5">
        <h1 id="head">OnboardX</h1>

        <div className="div6">
          <div className="div7">
            <h2 id="head2">Register</h2>

            <form onSubmit={handleSubmit}>
              <label>Company Name:</label><br />
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              /><br />

              <label>Email:</label><br />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              /><br />

              <label>GSTIN:</label><br />
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="15-character GSTIN"
                required
              /><br />

              <label>Password:</label><br />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              /><br />

              <button type="submit" id="btn">Register</button>
            </form>

            <p style={{ marginTop: "10px" }}>
              Already registered? <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>

      <div id="gradient">
        <img id="img" src={bg1} alt="background" />
      </div>
    </div>
  );
}

export default Registration;
