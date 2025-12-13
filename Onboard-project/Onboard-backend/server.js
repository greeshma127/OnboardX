import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";

const {Pool}=pkg;

let customers=[];

const app=express();
app.use(cors());
app.use(express.json())

const pool=new Pool({
    user:"postgres",
    host:"localhost",
    database:"customs_db",
    password:"pg2003",
    port:5432
});

app.get("/",(req,res)=>{
    res.json({message: "Working"});
});

app.get("/api/dashboard-data", async(req, res) => {
  res.json([
    { id: 1, message: "Welcome to your dashboard!" },
    { id: 2, message: "Your profile is updated." },
    { id: 3, message: "This is dummy API data." }
  ]);
});

app.listen(5000,()=>{
    console.log("Server running on port 5000");
})

app.post("/api/customers",async(req,res)=>{
    
    try {
        console.log("Received body:", req.body);
        const { name, email, phone,password} = req.body;
        if (!name || !email || !phone|| !password) return res.status(400).json({ message: "All fields are required" });

        const hashedPassword=await bcrypt.hash(password,10);
        
        const result = await pool.query(
            "INSERT INTO customers (name, email, phone,password) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, phone,hashedPassword]
        );

        res.status(201).json({ message: "Customer added successfully", customer: result.rows[0] });
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
});

app.get("/api/customers",async(req,res)=>{
    //res.json(customers);
    try{
        const result=await pool.query("SELECT * FROM customers");
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
})

app.get("/api/customers/:id",async(req,res)=>{
    
    try{
        const customerId=parseInt(req.params.id);
        const result=await pool.query("SELECT * FROM customers WHERE id=$1",[customerId]);
        if(result.rows.length===0) return res.status(404).json({message:"Customer not found"});
        res.json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
});

app.put("/api/customers/:id",async(req,res)=>{
    
    try {
        const customerId = parseInt(req.params.id);
        const { name, email, phone, company_name, company_type, iec_code, address } = req.body;
        if (!name || !email || !phone) return res.status(400).json({ message: "All fields are required" });

        const result = await pool.query(
  `UPDATE customers
   SET name=$1, email=$2, phone=$3, company_name=$4, company_type=$5, iec_code=$6, address=$7
   WHERE id=$8 RETURNING *`,
  [name, email, phone, company_name, company_type, iec_code, address, customerId]
);

        if (result.rows.length === 0) return res.status(404).json({ message: "Customer not found" });

        res.json({ message: "Customer updated successfully", customer: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.delete("/api/customers/:id",async(req,res)=>{
   
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

    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

    try {
        const result = await pool.query("SELECT * FROM customers WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        // Admin emails
        const adminEmails = ["admin@xyz.com"];
        let allUsers = [];

        if (adminEmails.includes(user.email.toLowerCase())) {
    const usersResult = await pool.query("SELECT * FROM customers");
    
    // Exclude admin from the list
    allUsers = usersResult.rows.filter(
        u => u.email.toLowerCase() !== user.email.toLowerCase()
    );
}


        res.json({
    message: "Login successful",
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company_name: user.company_name,   // add this
        company_type: user.company_type,   // add this
        iec_code: user.iec_code,           // add this
        address: user.address              // add this
    },
    allUsers
});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});