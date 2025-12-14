import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "customs_db",
  password: "pg2003",
  port: 5432
});

app.get("/", (req, res) => {
  res.json({ message: "Working" });
});

app.get("/api/dashboard-data", async (req, res) => {
  res.json([
    { id: 1, message: "Welcome to your dashboard!" },
    { id: 2, message: "Your profile is updated." },
    { id: 3, message: "This is dummy API data." }
  ]);
});

app.post("/api/register", async (req, res) => {
  try {
    const { company_name, email, gstin, password, phone, address } = req.body;
    if (!company_name || !email || !gstin || !password)
      return res.status(400).json({ message: "All required fields are missing" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO customers (company_name, email, gstin, password, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, company_name, email, gstin, phone, address`,
      [company_name, email, gstin, hashedPassword, phone || "", address || ""]
    );

    res.status(201).json({ message: "Registration successful", user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Email or GSTIN already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, company_name, email, gstin, phone, address FROM customers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      "SELECT id, company_name, email, gstin, phone, address FROM customers WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Customer not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const { company_name, email, gstin, password, phone, address } = req.body;

    if (!company_name || !email || !gstin)
      return res.status(400).json({ message: "Company name, email, and GSTIN are required" });

    let query = `UPDATE customers SET company_name=$1, email=$2, gstin=$3, phone=$4, address=$5`;
    const values = [company_name, email, gstin, phone || "", address || ""];

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password=$6 WHERE id=$7 RETURNING *`;
      values.push(hashedPassword, customerId);
    } else {
      query += ` WHERE id=$6 RETURNING *`;
      values.push(customerId);
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: "Customer not found" });

    res.json({ message: "Profile updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const result = await pool.query("DELETE FROM customers WHERE id=$1 RETURNING *", [customerId]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully", customer: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const result = await pool.query("SELECT * FROM customers WHERE email=$1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const adminEmails = ["admin@xyz.com"];
    let allUsers = [];

    if (adminEmails.includes(user.email.toLowerCase())) {
      const usersResult = await pool.query(
        "SELECT id, company_name, email, gstin, phone, address FROM customers"
      );
      allUsers = usersResult.rows.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        company_name: user.company_name,
        email: user.email,
        gstin: user.gstin,
        phone: user.phone,
        address: user.address
      },
      allUsers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});