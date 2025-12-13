import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard({ user, allUsers = [], setAllUsers, onLogout }) {
  const navigate = useNavigate();
  const isAdmin = allUsers.length > 0;

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    company_name: user.company_name || "",
    company_type: user.company_type || "",
    iec_code: user.iec_code || "",
    address: user.address || "",
  });

  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      company_name: user.company_name || "",
      company_type: user.company_type || "",
      iec_code: user.iec_code || "",
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
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        Object.assign(user, data.customer);

        if (isAdmin) {
          const allRes = await fetch("http://localhost:5000/api/customers");
          const list = await allRes.json();
          const filtered = list.filter((u) => u.email !== user.email);
          setAllUsers(filtered);
        }

        setEditMode(false);
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
      {/* Header */}
      <div id="header" style={{ height: "100px", position: "relative" }}>
        <h1 id="head" style={{ margin: 0,color:"white" }}>OnboardX</h1>
        <button
        id="logout"
          onClick={handleLogout}
          style={{
    padding: "10px 22px",
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "25px",
    backdropFilter: "blur(8px)",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    position: "absolute",
    right: 30,
    top: 30,
  }}
        >
          Logout
        </button>
      </div>

      <div style={{ margin: "10px", marginLeft: 120, padding: 10, paddingRight: "0px" }}>
        <h2 id="head2">Welcome, {user?.name}</h2>

        {isAdmin ? (
          <>
            <h3 id="head2">All Registered Users</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {allUsers.map((u) => (
                <div
                  key={u.id}
                  style={{
                    background: "white",
                    borderRadius: "8px",
                    padding: "10px 15px",
                    maxWidth: "650px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <p style={{ margin: "2px 0" }}><b>Name:</b> {u.name}</p>
                  <p style={{ margin: "2px 0" }}><b>Company Name:</b> {u.company_name || "Not provided"}</p>
                  <p style={{ margin: "2px 0" }}><b>Company Type:</b> {u.company_type || "Not provided"}</p>
                  <p style={{ margin: "2px 0" }}><b>IEC Code:</b> {u.iec_code || "Not provided"}</p>
                  <p style={{ margin: "2px 0" }}><b>Email:</b> {u.email}</p>
                  <p style={{ margin: "2px 0" }}><b>Phone:</b> {u.phone}</p>
                  <p style={{ margin: "2px 0" }}><b>Address:</b> {u.address || "Not provided"}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>

            <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label>Name:</label><br></br>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: "60%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Company Name:</label><br></br>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  style={{ width: "60%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label>Company Type:</label><br></br>
                <input
                  type="text"
                  name="company_type"
                  value={formData.company_type}
                  onChange={handleChange}
                  style={{ width: "60%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>IEC Code:</label><br></br>
                <input
                  type="text"
                  name="iec_code"
                  value={formData.iec_code}
                  onChange={handleChange}
                  style={{ width: "60%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label>Email:</label><br></br>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: "60%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Phone:</label><br></br>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: "60%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label>Address:</label><br></br>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{ width: "60%",height:25, marginBottom: 10, padding: "5px", border:"1px solid gray",borderRadius:5, fontSize:"15px" }}
              />
            </div>

            <button
            id="save"
              onClick={handleUpdate}
              style={{
    padding: "10px 22px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  }}
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
