# Database Schema

QuickStock Inventory Tracker uses an `items` table to store inventory records.

## Table: items

| Column | Type | Description |
|---|---|---|
| id | Integer / Serial | Primary key |
| name | Text | Inventory item name |
| category | Text | Item category |
| quantity | Integer | Current stock quantity |
| price | Decimal | Item price in RM |
| reorder_level | Integer | Minimum stock level before low-stock status |
| supplier | Text | Supplier name |
| notes | Text | Additional item notes |
| created_at | Date/Time | Record creation date and time |
| updated_at | Date/Time | Last update date and time |

## Main Use Cases Supported

- Create new inventory records
- Display all inventory records
- Search records by name, category, or supplier
- Filter records by category and stock status
- Sort records by selected fields
- Paginate long inventory lists
- Update existing inventory records
- Delete inventory records
- Generate dashboard summary statistics

## Database Options

- Local development uses SQLite.
- Live deployment uses PostgreSQL through Neon.
