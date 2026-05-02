const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const usePostgres = Boolean(process.env.DATABASE_URL);
const databaseFolder = path.join(__dirname, '../../database');
const databasePath = path.join(databaseFolder, 'quickstock_deploy.sqlite');

let db;
let pool;

const seedItems = [
  {
    name: 'Wireless Mouse',
    category: 'Electronics',
    quantity: 24,
    price: 39.9,
    reorderLevel: 8,
    supplier: 'TechZone Supplies',
    notes: 'Fast-moving computer accessory'
  },
  {
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    quantity: 12,
    price: 129.9,
    reorderLevel: 5,
    supplier: 'TechZone Supplies',
    notes: 'RGB keyboard stock'
  },
  {
    name: 'A4 Paper Ream',
    category: 'Office Supplies',
    quantity: 4,
    price: 15.5,
    reorderLevel: 10,
    supplier: 'OfficeMate',
    notes: 'Low stock item'
  },
  {
    name: 'Ball Pen Box',
    category: 'Office Supplies',
    quantity: 30,
    price: 12,
    reorderLevel: 10,
    supplier: 'OfficeMate',
    notes: 'Blue ink pens'
  },
  {
    name: 'Instant Coffee Pack',
    category: 'Pantry',
    quantity: 0,
    price: 18.9,
    reorderLevel: 6,
    supplier: 'PantryPro',
    notes: 'Out of stock'
  },
  {
    name: 'Hand Sanitizer',
    category: 'Cleaning',
    quantity: 9,
    price: 8.5,
    reorderLevel: 12,
    supplier: 'CleanPlus',
    notes: 'Low stock item'
  },
  {
    name: 'Safety Gloves',
    category: 'Safety',
    quantity: 50,
    price: 4.8,
    reorderLevel: 15,
    supplier: 'SafeWork Trading',
    notes: 'Warehouse safety use'
  },
  {
    name: 'Monitor Stand',
    category: 'Electronics',
    quantity: 7,
    price: 45,
    reorderLevel: 4,
    supplier: 'DeskEase',
    notes: 'Ergonomic desk accessory'
  }
];

function toPostgresSql(sql) {
  let counter = 0;
  return sql.replace(/\?/g, () => {
    counter += 1;
    return `$${counter}`;
  });
}

function isPostgresDb() {
  return usePostgres;
}

function connectDatabase() {
  if (usePostgres) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    return pool.query('SELECT 1');
  }

  return new Promise((resolve, reject) => {
    fs.mkdirSync(databaseFolder, { recursive: true });

    db = new sqlite3.Database(databasePath, (error) => {
      if (error) {
        reject(error);
        return;
      }

      db.run('PRAGMA foreign_keys = ON');
      resolve(db);
    });
  });
}

function getDatabase() {
  if (!db && !pool) {
    throw new Error('Database is not connected yet');
  }

  return usePostgres ? pool : db;
}

function run(sql, params = []) {
  if (usePostgres) {
    return getDatabase()
      .query(toPostgresSql(sql), params)
      .then((result) => ({
        id: result.rows[0] ? result.rows[0].id : undefined,
        changes: result.rowCount
      }));
  }

  return new Promise((resolve, reject) => {
    getDatabase().run(sql, params, function handleRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  if (usePostgres) {
    return getDatabase()
      .query(toPostgresSql(sql), params)
      .then((result) => result.rows[0]);
  }

  return new Promise((resolve, reject) => {
    getDatabase().get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  if (usePostgres) {
    return getDatabase()
      .query(toPostgresSql(sql), params)
      .then((result) => result.rows);
  }

  return new Promise((resolve, reject) => {
    getDatabase().all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function createTables() {
  if (usePostgres) {
    await run(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        reorder_level INTEGER NOT NULL DEFAULT 5,
        supplier TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    return;
  }

  await run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL DEFAULT 0,
      reorder_level INTEGER NOT NULL DEFAULT 5,
      supplier TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function seedDatabase() {
  const row = await get('SELECT COUNT(*) AS count FROM items');
  const count = Number(row.count);

  if (count > 0) {
    return;
  }

  for (const item of seedItems) {
    await run(
      `
        INSERT INTO items (name, category, quantity, price, reorder_level, supplier, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        item.name,
        item.category,
        item.quantity,
        item.price,
        item.reorderLevel,
        item.supplier,
        item.notes
      ]
    );
  }
}

async function initDatabase() {
  await connectDatabase();
  await createTables();
  await seedDatabase();
}

module.exports = {
  initDatabase,
  run,
  get,
  all,
  isPostgresDb
};
