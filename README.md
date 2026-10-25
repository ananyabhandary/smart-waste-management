# Smart Waste Management System (MERN)

Roles: **Admin**, **Waste Collector**, **Citizen** with JWT authentication and role-based access control.

## Run in VS Code
Requires Node.js 18+ and MongoDB (local) or a MongoDB Atlas URI in `backend/.env`.

Terminal 1:
    cd backend
    npm install
    npm run seed
    npm run dev

Terminal 2:
    cd frontend
    npm install
    npm run dev

Open http://localhost:5173

Demo logins (password 123456): admin@waste.com, collector@waste.com, citizen@waste.com

## API
POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
GET/POST /api/bins, PATCH /api/bins/:id/level, DELETE /api/bins/:id
POST/GET /api/requests, PATCH /api/requests/:id/assign, PATCH /api/requests/:id/collect
GET /api/users/collectors, GET /api/stats
