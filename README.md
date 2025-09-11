# Blog Platform (API + Client)

A full-stack blogging platform with tournaments. Backend is an Express + MongoDB API; frontend is a React + Vite app styled with Tailwind.

## Project Structure

```
blog/
  BlogAPI/        # Node/Express API server
  BlogClient/     # React client (Vite)
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or hosted)

## Environment Variables

Create `BlogAPI/.env` with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog
JWT_SECRET=your-strong-secret
NODE_ENV=development
```

Optional: update CORS allowed origins in `BlogAPI/server.js` if your client runs on a different URL.

## Install & Run

- API
  1. Open a terminal in `BlogAPI`
  2. Install deps: `npm install`
  3. Run dev server: `npm run dev`
  4. Base URL: `http://localhost:5000`

- Client
  1. Open another terminal in `BlogClient`
  2. Install deps: `npm install`
  3. Run dev server: `npm run dev`
  4. Default URL: `http://localhost:5173`

## API Overview

Base path: `/api`

- Auth: `/api/auth`
- Blogs: `/api/blogs`
- Tournaments: `/api/tournaments`
- Admin: `/api/admin` (requires `admin` role)

Auth uses HTTP-only cookies by default but also accepts `Authorization: Bearer <token>`.

### Auth Routes (`/api/auth`)

- POST `/register` — register new user
  - Body: `{ username, email, password }`
  - 201: `{ success, message, data: { _id, username, email, roles, totalWins } }`
  - Sets `token` cookie

- POST `/login` — login
  - Body: `{ email, password }`
  - 200: `{ success, message, data }`
  - Sets `token` cookie

- POST `/logout` — logout (auth required)
  - Clears `token` cookie

- GET `/me` — current user (auth required)
  - 200: `{ success, data }`

- POST `/promote-admin` — promote by email (bootstrap only)
  - Body: `{ email }`
  - 200: `{ success, message, data }`

CLI alternative to promote:

```
cd BlogAPI
node promote-admin.js admin@example.com
```

### Blog Routes (`/api/blogs`)

- GET `/` — list blogs
  - Query: `category`, `page` (default 1), `limit` (default 10)
  - 200: `{ success, count, total, currentPage, totalPages, data: Blog[] }`

- GET `/:id` — get blog by id
  - 200: `{ success, data: Blog }`

- GET `/user/my-blogs` — list current user blogs (auth)
  - Query: `page`, `limit`
  - 200: `{ success, count, total, currentPage, totalPages, data }`

- POST `/` — create blog (auth)
  - Body: `{ title, content, image?, category }`
  - Categories: `art | sci-fi | technology | food | travel | sports`
  - 201: `{ success, message, data: Blog }`

- PUT `/:id` — update blog (author only)
  - Body: any of `{ title, content, image, category }`
  - 200: `{ success, message, data }`

- DELETE `/:id` — delete blog (author only)
  - 200: `{ success, message }`

### Tournament Routes (`/api/tournaments`)

- GET `/` — list tournaments (public)
  - 200: `{ success, data: Tournament[] }`

- GET `/:id` — get single tournament (public)
  - 200: `{ success, data: Tournament }`

- POST `/` — create tournament (admin)
  - Auth: admin
  - Body: `{ name, size, blogs: ObjectId[], matchDurationMinutes? }`
  - `size`: one of `4 | 8 | 16 | 32`
  - 201: `{ success, data: Tournament }`

- POST `/:id/start` — start tournament (admin)
  - Auth: admin
  - 200: `{ success, data: Tournament }`

- DELETE `/:id` — delete tournament (admin)
  - Auth: admin
  - 200: `{ success, message }`

- POST `/:id/register` — register your blog (auth)
  - Body: `{ blogId }` (must belong to current user)
  - 200: `{ success, data: Tournament }`

- POST `/:id/matches/:index/vote` — vote in a match (auth)
  - Body: `{ pick: 'A' | 'B' }`
  - 200: `{ success, data: Match }`

### Admin Routes (`/api/admin`) — all require admin role

- GET `/dashboard` — summary stats and recent items
- GET `/blogs` — paginated blogs
- DELETE `/blogs/:id` — delete blog
- GET `/tournaments` — paginated tournaments
- DELETE `/tournaments/:id` — delete tournament
- DELETE `/tournaments/:tournamentId/matches/:matchIndex/votes` — reset votes for a match
- GET `/users` — paginated users
- DELETE `/users/:id` — delete user (cannot delete self)

## Auth Details

- Protection middleware checks `req.cookies.token` first, else `Authorization: Bearer <token>`
- JWT secret: `JWT_SECRET`
- Cookie options adjusted by `NODE_ENV`

## CORS

Allowed origins configured in `BlogAPI/server.js`:

```
http://localhost:5173
http://127.0.0.1:5173
```

Update `allowedOrigins` for your deployment.

## Example Requests

- Register

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{ "username": "alice", "email": "alice@example.com", "password": "Passw0rd!" }
```

- Create Blog (after login; send cookie automatically or use Bearer token)

```
POST http://localhost:5000/api/blogs
Authorization: Bearer <JWT>
Content-Type: application/json

{ "title": "My Post", "content": "...", "category": "technology" }
```

- Vote in a Match

```
POST http://localhost:5000/api/tournaments/<id>/matches/0/vote
Authorization: Bearer <JWT>
Content-Type: application/json

{ "pick": "A" }
```

## Client (BlogClient)

- Scripts
  - `npm run dev` — start dev server
  - `npm run build` — production build
  - `npm run preview` — preview build
  - `npm run lint` — lint code

The client is configured for React 19, React Router, Redux Toolkit, Axios, and Tailwind. Set API base URL in your data layer or env if you add one.

## Tips

- Ensure MongoDB is running and `MONGO_URI` is reachable before starting API
- First user can be promoted to admin using `/api/auth/promote-admin` or the CLI script
- Keep `JWT_SECRET` strong and private
