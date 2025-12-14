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
    navigate("/dashboard"); 
  };

  return (
    <div className="div">
      <div className="div1">
        <h1 id="head">OnboardX</h1>
        <div className="div2">
          <div className="div3">
            <h2 id="head2">Welcome Back</h2>
            <form onSubmit={handleSubmit}>
              <label>Email Address:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}/><br></br>

              <label>Password:</label><br></br>
              <input type="password" name="password" value={formData.password} onChange={handleChange}/>

              <button id="btn" type="submit">Login</button>
            </form>

            <p id="sign-up">Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>
        </div>
      </div>

      <div id="gradient">
        <img id="img" src={bg1} alt="background"/>
      </div>
    </div>
);
}

export default Login;
