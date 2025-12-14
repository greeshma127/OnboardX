import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard({ user, allUsers = [], setAllUsers, onLogout }) {
  const navigate = useNavigate();
  const isAdmin = allUsers.length > 0;

  const [formData, setFormData] = useState({
    company_name: user.company_name || "",
    email: user.email || "",
    gstin: user.gstin || "",
    password: "",
    phone: user.phone || "",
    address: user.address || "",
  });

  useEffect(() => {
    setFormData({
      company_name: user.company_name || "",
      email: user.email || "",
      gstin: user.gstin || "",
      password: "",
      phone: user.phone || "",
      address: user.address || "",
    });
  }, [user]);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/customers/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone || "",
          address: formData.address || "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        Object.assign(user, data.user);

        if (allUsers.length > 0) {
          const allRes = await fetch("http://localhost:5000/api/customers");
          const list = await allRes.json();
          const filtered = list.filter(u => u.email !== user.email);
          setAllUsers(filtered);
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div>
      <div id="header">
        <h1 id="headx">OnboardX</h1>
        <button id="logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className="div8">
        <h2 id="head2">Welcome, {user.company_name || user.email}</h2>

        {isAdmin ? (
          <>
            <h3 id="head2">All Registered Users</h3>
            <div className="div9">
              {allUsers.map(u => (
                <div className="div10" key={u.id}>
                  <p id="p"><b>Company Name:</b> {u.company_name}</p>
                  <p id="p"><b>Email:</b> {u.email}</p>
                  <p id="p"><b>GSTIN:</b> {u.gstin}</p>
                  <p id="p"><b>Phone Number:</b> {u.phone}</p>
                  <p id="p"><b>Address:</b> {u.address}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="div11">
              <div className="div12">
                <label>Company Name:</label><br/>
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange}/>
              </div>
              <div className="div12">
                <label>Email:</label><br/>
                <input type="email" name="email" value={formData.email} onChange={handleChange}/>
              </div>
            </div>

            <div className="div11">
              <div className="div12">
                <label>GSTIN:</label><br/>
                <input type="text" name="gstin" value={formData.gstin} onChange={handleChange}/>
              </div>
              <div className="div12">
                <label>Password (optional):</label><br/>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password"/>
              </div>
            </div>

            <div className="div11">
              <div className="div12">
                <label>Address:</label><br/>
                <textarea name="address" value={formData.address || ""} onChange={handleChange}/>
              </div>
              <div className="div12">
                <label>Phone Number:</label><br/>
                <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange}/>
              </div>
            </div>

            <button id="save" onClick={handleUpdate}>Save</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;