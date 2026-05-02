const categories = [
  'Electronics',
  'Office Supplies',
  'Pantry',
  'Cleaning',
  'Safety',
  'Other'
];

function cleanText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function validateItem(payload) {
  const errors = {};

  const name = cleanText(payload.name);
  const category = cleanText(payload.category);
  const supplier = cleanText(payload.supplier);
  const notes = cleanText(payload.notes);
  const quantity = Number(payload.quantity);
  const price = Number(payload.price);
  const reorderLevel = Number(payload.reorderLevel);

  if (!name) {
    errors.name = 'Item name is required.';
  } else if (name.length < 2) {
    errors.name = 'Item name must be at least 2 characters.';
  } else if (name.length > 80) {
    errors.name = 'Item name must not exceed 80 characters.';
  }

  if (!category) {
    errors.category = 'Category is required.';
  } else if (!categories.includes(category)) {
    errors.category = 'Please choose a valid category.';
  }

  if (!Number.isInteger(quantity)) {
    errors.quantity = 'Quantity must be a whole number.';
  } else if (quantity < 0) {
    errors.quantity = 'Quantity cannot be negative.';
  } else if (quantity > 99999) {
    errors.quantity = 'Quantity is too large.';
  }

  if (Number.isNaN(price)) {
    errors.price = 'Price is required.';
  } else if (price < 0) {
    errors.price = 'Price cannot be negative.';
  } else if (price > 999999) {
    errors.price = 'Price is too large.';
  }

  if (!Number.isInteger(reorderLevel)) {
    errors.reorderLevel = 'Reorder level must be a whole number.';
  } else if (reorderLevel < 0) {
    errors.reorderLevel = 'Reorder level cannot be negative.';
  } else if (reorderLevel > 99999) {
    errors.reorderLevel = 'Reorder level is too large.';
  }

  if (supplier.length > 80) {
    errors.supplier = 'Supplier must not exceed 80 characters.';
  }

  if (notes.length > 250) {
    errors.notes = 'Notes must not exceed 250 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      name,
      category,
      quantity,
      price,
      reorderLevel,
      supplier,
      notes
    }
  };
}

module.exports = {
  categories,
  validateItem
};
