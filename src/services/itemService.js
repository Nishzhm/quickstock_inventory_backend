const { all, get, run, isPostgresDb } = require('../config/db');

const itemSelect = `
  id,
  name,
  category,
  quantity,
  price,
  reorder_level AS "reorderLevel",
  supplier,
  notes,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const sortFieldMap = {
  name: 'name',
  category: 'category',
  quantity: 'quantity',
  price: 'price',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
};

function normalizeNumber(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);

  if (Number.isNaN(number)) {
    return fallback;
  }

  return Math.min(Math.max(number, min), max);
}

function normalizeItem(row) {
  if (!row) {
    return row;
  }

  return {
    ...row,
    quantity: Number(row.quantity),
    price: Number(row.price),
    reorderLevel: Number(row.reorderLevel)
  };
}

function buildListQuery(query) {
  const conditions = [];
  const params = [];

  if (query.search) {
    const searchTerm = `%${String(query.search).trim()}%`;
    conditions.push('(name LIKE ? OR category LIKE ? OR supplier LIKE ?)');
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (query.category && query.category !== 'all') {
    conditions.push('category = ?');
    params.push(query.category);
  }

  if (query.status === 'low') {
    conditions.push('quantity > 0 AND quantity <= reorder_level');
  }

  if (query.status === 'out') {
    conditions.push('quantity = 0');
  }

  if (query.status === 'healthy') {
    conditions.push('quantity > reorder_level');
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return {
    whereClause,
    params
  };
}

async function listItems(query) {
  const page = normalizeNumber(query.page, 1, 1, 9999);
  const limit = normalizeNumber(query.limit, 8, 1, 50);
  const offset = (page - 1) * limit;
  const sortBy = sortFieldMap[query.sortBy] || 'created_at';
  const order = query.order === 'asc' ? 'ASC' : 'DESC';
  const { whereClause, params } = buildListQuery(query);

  const countRow = await get(`SELECT COUNT(*) AS total FROM items ${whereClause}`, params);
  const items = await all(
    `
      SELECT ${itemSelect}
      FROM items
      ${whereClause}
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `,
    [...params, limit, offset]
  );

  const total = Number(countRow.total);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    data: items.map(normalizeItem),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}

async function getItemById(id) {
  const item = await get(`SELECT ${itemSelect} FROM items WHERE id = ?`, [id]);
  return normalizeItem(item);
}

async function createItem(item) {
  const params = [
    item.name,
    item.category,
    item.quantity,
    item.price,
    item.reorderLevel,
    item.supplier,
    item.notes
  ];

  const insertSql = isPostgresDb()
    ? `
        INSERT INTO items (name, category, quantity, price, reorder_level, supplier, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `
    : `
        INSERT INTO items (name, category, quantity, price, reorder_level, supplier, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

  const result = await run(insertSql, params);
  return getItemById(result.id);
}

async function updateItem(id, item) {
  const result = await run(
    `
      UPDATE items
      SET name = ?,
          category = ?,
          quantity = ?,
          price = ?,
          reorder_level = ?,
          supplier = ?,
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      item.name,
      item.category,
      item.quantity,
      item.price,
      item.reorderLevel,
      item.supplier,
      item.notes,
      id
    ]
  );

  if (result.changes === 0) {
    return null;
  }

  return getItemById(id);
}

async function deleteItem(id) {
  const result = await run('DELETE FROM items WHERE id = ?', [id]);
  return result.changes > 0;
}

async function getStats() {
  const summary = await get(`
    SELECT
      COUNT(*) AS "totalItems",
      COALESCE(SUM(quantity * price), 0) AS "totalValue",
      SUM(CASE WHEN quantity = 0 THEN 1 ELSE 0 END) AS "outOfStock",
      SUM(CASE WHEN quantity > 0 AND quantity <= reorder_level THEN 1 ELSE 0 END) AS "lowStock",
      SUM(CASE WHEN quantity > reorder_level THEN 1 ELSE 0 END) AS "healthyStock",
      COUNT(DISTINCT category) AS "categoryCount"
    FROM items
  `);

  const categories = await all(`
    SELECT category, COUNT(*) AS total
    FROM items
    GROUP BY category
    ORDER BY total DESC
  `);

  const recentItems = await all(`
    SELECT ${itemSelect}
    FROM items
    ORDER BY created_at DESC
    LIMIT 5
  `);

  return {
    totalItems: Number(summary.totalItems || 0),
    totalValue: Number(Number(summary.totalValue || 0).toFixed(2)),
    outOfStock: Number(summary.outOfStock || 0),
    lowStock: Number(summary.lowStock || 0),
    healthyStock: Number(summary.healthyStock || 0),
    categoryCount: Number(summary.categoryCount || 0),
    categories: categories.map((category) => ({
      category: category.category,
      total: Number(category.total)
    })),
    recentItems: recentItems.map(normalizeItem)
  };
}

module.exports = {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats
};
