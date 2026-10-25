# Smart Waste Management System (MERN)

A full-stack waste management app with three roles (**Admin**, **Waste Collector**, **Citizen**), JWT authentication and role-based access control.

## Features
- Citizens request waste pickups and track their status
- Admin manages bins, sees dashboard stats and assigns pickups to collectors
- Collectors view assigned pickups, mark them collected and update bin fill levels
- Bin status (low / medium / full) is calculated from the fill level

## Tech Stack
React.js (Vite), Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt

## Run Locally
Requires Node.js 18+ and MongoDB (local) or a MongoDB Atlas URI in `backend/.env`.

Backend:
```
cd backend
npm install
npm run seed
npm run dev
```

Frontend (new terminal):
```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Demo logins (password `123456`): `admin@waste.com`, `collector@waste.com`, `citizen@waste.com`

## API Endpoints
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| GET, POST | /api/bins | Logged in / Admin |
| PATCH | /api/bins/:id/level | Admin, Collector |
| DELETE | /api/bins/:id | Admin |
| POST, GET | /api/requests | Citizen / Logged in |
| PATCH | /api/requests/:id/assign | Admin |
| PATCH | /api/requests/:id/collect | Admin, Collector |
| GET | /api/users/collectors, /api/stats | Admin |