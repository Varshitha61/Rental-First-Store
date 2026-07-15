# Borrow — Premium Gear Rental Platform

Borrow is a full-stack e-commerce web application where every product is rented instead of bought. Built using a modern dark-mode aesthetic with React (Vite + Tailwind CSS v4), Node.js, Express, and MongoDB.

---

## 🚀 Features

* **Dynamic Product Search & Category Grid**: Filter items dynamically client-side.
* **Price Calculations**: Estimations are calculated on both client and server (based on daily rental rates and total days).
* **Double-Booking Prevention**: Date ranges are checked on the server to prevent conflicting reservations.
* **In-Memory JWT Sessions**: Authentication tokens are kept strictly in-memory (React Context) instead of localStorage for premium security.
* **Return Controls**: Active rentals can be marked as returned with real-time status updates.
* **Modern Toast System**: Seamless slide-in toast notifications for user interactions.

---

## 🛠️ Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or an Atlas URI)

---

### Step 1: Install Dependencies
Run dependency installation in both folders (or use monorepo controls):

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install

# Install root developer orchestrators
cd ..
npm install
```

---

### Step 2: Configure Environment Variables
Create a `.env` file inside the `server/` directory:

```bash
cp server/.env.example server/.env
```

Ensure the variables are set correctly:
* `MONGO_URI`: `mongodb://localhost:27017/borrow` (or your remote connection string)
* `PORT`: `5000`
* `JWT_SECRET`: `your_super_secret_key_here`

---

### Step 3: Seed Database
Populate your database with the sample set of 9 high-end products (DSLRs, camping gear, mountain bikes, etc.):

```bash
# Run seed from monorepo root
npm run seed
```

---

### Step 4: Run Application
Start both the back-end Express server and the front-end Vite dev server concurrently:

```bash
# From the project root
npm run dev
```

* **Vite Frontend**: `http://localhost:3000`
* **Express Backend**: `http://localhost:5000`

---

## 🐳 Docker Deployment

The application is completely containerized. Docker Compose spins up MongoDB, the Express backend, and Nginx (building and serving the React bundle statically).

Build and launch the containers:

```bash
docker compose up --build
```

Access the application in your browser at:
* **Borrow Web App**: `http://localhost` (Port 80)
* **Backend API**: `http://localhost/api`
