# QuickStock Backend

Express.js backend API for the QuickStock Inventory Tracker system.

## Run Backend Locally

```bash
cd backend
npm install
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

## Main Endpoints

- `GET /api/health`
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
- `GET /api/items/stats/summary`

## Structure

```text
src/config        Database connection and setup
src/controllers   Request and response handling
src/routes        API route definitions
src/services      Business logic and database queries
src/middleware    Error and route handling
src/utils         Request validation
```
