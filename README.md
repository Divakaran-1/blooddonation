# 🩸 LifeDrop - Blood Donation Management Portal

A full-stack web application built with **React.js, Node.js, Express, MongoDB (MERN Stack), HTML5, and Modern CSS** to streamline blood donor registration, emergency blood request management, and real-time compatibility matching.

---

## 🌟 Key Features

1. **Donor Registration & Profile Management**
   - Register voluntary blood donors with full demographic and medical data (Blood group, Age, Gender, City, Address, Pincode, Last donation date, Medical notes).
   - Real-time form validations (age 18–65, valid email, phone number format).
   - Toggle availability status (`Available` / `Unavailable`).

2. **Emergency Blood Requests Board**
   - Hospitals, clinics, and attendants can post urgent transfusion requests.
   - Specify required blood group, units/bags needed, hospital name, and urgency level (`Critical`, `Urgent`, `Standard`).
   - Track request statuses: `Pending` ➔ `Approved` ➔ `Fulfilled` ➔ `Cancelled`.

3. **Smart Blood Compatibility Matching**
   - Automatically identifies compatible donors based on biological blood compatibility rules (e.g., O- Universal Donor, AB+ Universal Recipient).
   - Filter compatible donors by city and availability.

4. **Live Dashboard & Analytics**
   - Real-time metrics: Total donors, donors ready right now, pending requests, critical emergencies.
   - Blood inventory and donor count breakdown across all 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-).

5. **Interactive Blood Compatibility Matrix**
   - Educational guide & interactive checker for donors and recipients.

---

## 🏗️ Project Architecture

```
web project/
├── server/                     # Backend (Node.js & Express)
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── models/
│   │   ├── Donor.js            # Mongoose Donor model
│   │   └── BloodRequest.js     # Mongoose BloodRequest model
│   ├── routes/
│   │   ├── donorRoutes.js      # REST API endpoints for donors
│   │   └── requestRoutes.js    # REST API endpoints for requests
│   ├── controllers/
│   │   ├── donorController.js  # Controller logic & compatibility math
│   │   └── requestController.js# Request management & dashboard stats
│   ├── seed.js                 # Realistic seed data script
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js               # Server entry point
│
├── client/                     # Frontend (React & Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header & tab navigation
│   │   │   ├── Dashboard.jsx            # Portal stats & overview
│   │   │   ├── DonorRegistration.jsx   # Donor onboarding form
│   │   │   ├── DonorList.jsx            # Filterable donor directory
│   │   │   ├── RequestBlood.jsx         # Emergency request form
│   │   │   ├── RequestList.jsx          # Live request board & status
│   │   │   └── CompatibilityMatrix.jsx  # Compatibility guide & tool
│   │   ├── services/
│   │   │   └── api.js                   # API client service
│   │   ├── App.jsx                      # Main app container
│   │   ├── main.jsx                     # React root mount
│   │   └── index.css                    # Modern blood-theme styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                   # Vite configuration with proxy
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

### Step 2: Configure Environment Variables

The backend configuration is located in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blood_donation_db
NODE_ENV=development
```

> **Note on MongoDB**:
> - If you have MongoDB installed locally, the server connects automatically to `mongodb://127.0.0.1:27017/blood_donation_db`.
> - If you use **MongoDB Atlas** (cloud), replace `MONGODB_URI` with your connection string:
>   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/blood_donation_db?retryWrites=true&w=majority`

---

### Step 3: (Optional) Seed Sample Data

To populate the database with realistic donors and blood requests for immediate testing:

```bash
cd server
npm run seed
```

---

### Step 4: Run the Application

Open two terminal windows:

#### Terminal 1: Start Backend API
```bash
cd server
npm run dev
# Server will run on: http://localhost:5000
```

#### Terminal 2: Start React Frontend
```bash
cd client
npm run dev
# Frontend will run on: http://localhost:3000
```

Open your browser and navigate to: **`http://localhost:3000`**

---

## 📡 API Endpoints Reference

### Donors API (`/api/donors`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/donors` | Register a new donor |
| `GET` | `/api/donors` | Get all donors (supports `?bloodGroup=`, `?city=`, `?isAvailable=`, `?search=`) |
| `GET` | `/api/donors/compatible` | Find compatible donors (`?bloodGroup=O+&city=Chennai`) |
| `GET` | `/api/donors/:id` | Get single donor by ID |
| `PUT` | `/api/donors/:id` | Update donor information |
| `PATCH` | `/api/donors/:id/availability` | Toggle donor availability status |
| `DELETE` | `/api/donors/:id` | Remove a donor |

### Blood Requests API (`/api/requests`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/requests` | Post an emergency blood request |
| `GET` | `/api/requests` | Get all requests (supports `?status=`, `?bloodGroup=`, `?urgency=`) |
| `GET` | `/api/requests/stats/dashboard` | Aggregated dashboard stats & blood counts |
| `GET` | `/api/requests/:id` | Get single blood request |
| `PATCH` | `/api/requests/:id/status` | Update status (`Pending`, `Approved`, `Fulfilled`, `Cancelled`) |
| `DELETE` | `/api/requests/:id` | Delete a request |

---

## 🩸 Blood Compatibility Rules Implemented

| Blood Group | Can Donate To (Gives) | Can Receive From |
|---|---|---|
| **O-** | **All Types (Universal Donor)** | O- |
| **O+** | O+, A+, B+, AB+ | O+, O- |
| **A-** | A-, A+, AB-, AB+ | A-, O- |
| **A+** | A+, AB+ | A+, A-, O+, O- |
| **B-** | B-, B+, AB-, AB+ | B-, O- |
| **B+** | B+, AB+ | B+, B-, O+, O- |
| **AB-** | AB-, AB+ | AB-, A-, B-, O- |
| **AB+** | AB+ | **All Types (Universal Recipient)** |

---

## 🛠️ Tech Stack Used

- **Frontend**: React 19, Lucide Icons, Vite, HTML5, CSS3 (Responsive Grid, Custom Variables, Glassmorphism)
- **Backend**: Node.js, Express.js, Mongoose ODM, CORS, Dotenv
- **Database**: MongoDB (Local or MongoDB Atlas)

