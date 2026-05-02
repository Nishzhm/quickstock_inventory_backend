# Live Deployment Guide

This guide explains deployment using:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

This setup is suitable for live demonstration because the PostgreSQL database stays online separately from the backend server.

## Step 1: Create GitHub Repository

1. Open GitHub.
2. Create a new repository named `quickstock-inventory-tracker`.
3. Upload the full project folder.
4. Confirm these folders are visible in GitHub:
   - `frontend`
   - `backend`

## Step 2: Create Neon Database

1. Open Neon.
2. Create a new project.
3. Select Connect.
4. Copy the Node.js connection string.
5. Save this value for Render:

```text
DATABASE_URL=postgresql://...
```

## Step 3: Deploy Backend on Render

1. Open Render.
2. Select New.
3. Select Web Service.
4. Connect the GitHub repository.
5. Use these settings:

| Setting | Value |
|---|---|
| Name | quickstock-backend |
| Root Directory | backend |
| Runtime | Node |
| Build Command | npm install |
| Start Command | npm start |

6. Add environment variables:

```text
DATABASE_URL=<neon-postgresql-connection-string>
FRONTEND_URL=http://localhost:5173
PORT=5000
```

7. Select Deploy Web Service.
8. After deployment, open:

```text
https://<render-backend-name>.onrender.com/api/health
```

Expected response:

```json
{"success":true,"message":"QuickStock API is running."}
```

## Step 4: Deploy Frontend on Vercel

1. Open Vercel.
2. Select Add New Project.
3. Import the same GitHub repository.
4. Use these settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | frontend |
| Build Command | npm run build |
| Output Directory | dist |

5. Add this environment variable:

```text
VITE_API_BASE_URL=https://<render-backend-name>.onrender.com/api
```

6. Select Deploy.

## Step 5: Update Render After Vercel Deployment

After Vercel provides the frontend link, return to Render.

Change this environment variable:

```text
FRONTEND_URL=https://<vercel-frontend-name>.vercel.app
```

Then redeploy the backend.

## Step 6: Test Live System

Open the Vercel frontend link and test:

1. Dashboard loads.
2. Inventory records display.
3. Add item works.
4. Edit item works.
5. Delete item works.
6. Search works.
7. Filtering works.
8. Sorting works.
9. Pagination works.
10. Browser refresh keeps stored data.

## Step 7: Add Deployment Links in README

Update the README live deployment section:

```text
Frontend live link: https://<vercel-frontend-name>.vercel.app
Backend API link: https://<render-backend-name>.onrender.com/api/health
```
