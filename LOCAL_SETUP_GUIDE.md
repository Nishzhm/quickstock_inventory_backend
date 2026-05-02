# Local Setup Guide

This guide explains the steps required to run QuickStock Inventory Tracker locally in VS Code.

## Project Folders

The project contains two main folders:

1. `frontend`, React user interface
2. `backend`, Express API and database connection

## Software Requirement

Node.js LTS must be installed before running the project.

After installing Node.js, restart VS Code.

## Open Project in VS Code

1. Open VS Code.
2. Select File.
3. Select Open Folder.
4. Select the extracted `quickstock-inventory-tracker` project folder.

## Run Backend First

Open a terminal in VS Code.

```bash
cd backend
npm install
npm run dev
```

Successful output:

```text
QuickStock backend running on http://localhost:5000
```

Keep this terminal open.

## Run Frontend Second

Open a second terminal in VS Code.

```bash
cd frontend
npm install
npm run dev
```

Successful output includes a local website link.

Open:

```text
http://localhost:5173
```

## Demo Flow

1. Dashboard page loads summary from the database.
2. Inventory page displays backend data.
3. Search function filters item records.
4. Category filter changes displayed records.
5. Sorting changes record order.
6. Pagination changes record pages.
7. Add item form creates a new record.
8. Edit item form updates an existing record.
9. Delete function removes a record.
10. Backend API and database connection are shown through the working data flow.

## Common Error Fixes

### Error: npm is not recognized

Node.js is not installed correctly. Install Node.js LTS, then restart VS Code.

### Frontend opens but data does not load

The backend server is not running. Start backend using:

```bash
cd backend
npm run dev
```

### Port already in use

Close old terminals, then run the command again.

### Database looks empty

The backend creates seed data when the database is first created. Delete this file, then restart backend:

```text
backend/database/quickstock_deploy.sqlite
```
