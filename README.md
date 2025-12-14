# OnboardX

Project Overview
OnboardX is a web-based customer onboarding and management system built using React, Node.js, Express and PostgreSQL. The system supports user registration, login, profile management, and admin-level user management.

How to Run the Project:
1. Create a PostgreSQL database:
   CREATE DATABASE customs_db;
2. Create the customers table:
   CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      gstin VARCHAR(20) UNIQUE,
      password TEXT,
      phone VARCHAR(20),
      address TEXT
    );
3. Backend setup:
   cd Onboard-project/Onboard-backend
   npm install
   node server.js
   Server will run on http://localhost:5000
5. Frontend setup:
   cd Onboard-project/onboard-frontend
   npm install
   npm start
   Frontend will run on http://localhost:3000

System Architecture
1. Frontend:
   The Frontend is built using React. It handles user registration and login and view dashboards of both admin and users. Files: Login.js, Registration.js and Dashboard.js
2. Backend:
   The Backend is built using Node.js and Express.js. It performs user registration, user authentication, profile update and fetches users. File: server.js
3. Database:
   PostgreSQL is used to save user data securely. Database Table name: customers. Table consists of id, company_name, email, gstin, password, phone and address.

Security
1. Password:
   -Passwords are never stored in plain text.
   -Uses bcrypt hashing with salt before saving to the database.
   -Password comparison is done using bcrypt during login.
2. User authentication:
   -User login is validated against hashed credentials
   -Invalid credentials return appropriate error responses
   -Admin identification is handled securely at login level
3. SQL Injection Prevention:
   -Uses parameterized queries with PostgreSQL ($1, $2, ...)
   -Prevents malicious SQL execution
4. Data Integrity & Validation
   -Server-side validation for required fields
