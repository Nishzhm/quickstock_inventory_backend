# Project Requirements Mapping

This file explains how QuickStock Inventory Tracker satisfies the final fullstack project requirements.

## 1. Core Fullstack Functionality, 25 marks

- React frontend is included in the `frontend` folder.
- Express backend API is included in the `backend` folder.
- SQLite stores local data persistently.
- PostgreSQL support is included for live deployment.
- Frontend communicates with backend through REST API calls.

## 2. Advanced Features, 25 marks

The project includes four advanced features:

1. Search
2. Filtering
3. Sorting
4. Pagination

## 3. Frontend UX and Handling, 20 marks

- Dashboard page displays summary cards and stock status.
- Inventory page displays database records in a table.
- Add item and edit item forms allow data entry and updates.
- Loading spinner appears during API requests.
- Error banner appears when API requests fail.
- Empty state appears when no inventory records match the current filters.
- The interface uses clear navigation and responsive layout.

## 4. Backend Structure and Quality, 15 marks

- Routes are separated in `routes`.
- Controllers handle request and response logic.
- Services handle database queries and business logic.
- Middleware handles route-not-found and server error responses.
- Validators check incoming request body data.
- Proper HTTP status codes are returned.

## 5. Code Quality, 10 marks

- File structure is organized by responsibility.
- Function names are descriptive.
- API response format is consistent.
- Reusable frontend components are used.
- Backend validation and database logic are separated.

## 6. Additional Features and Deployment, 5 marks

- The project is deployment-ready for Vercel, Render, and Neon PostgreSQL.
- Deployment instructions are included in `DEPLOYMENT_GUIDE.md`.
