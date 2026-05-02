const itemService = require('../services/itemService');
const { validateItem } = require('../utils/validators');

function parseId(id) {
  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

async function listItems(req, res, next) {
  try {
    const result = await itemService.listItems(req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function getItemById(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Invalid item ID.'
      });
      return;
    }

    const item = await itemService.getItemById(id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
}

async function createItem(req, res, next) {
  try {
    const validation = validateItem(req.body);

    if (!validation.isValid) {
      res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.errors
      });
      return;
    }

    const item = await itemService.createItem(validation.value);

    res.status(201).json({
      success: true,
      message: 'Item created successfully.',
      data: item
    });
  } catch (error) {
    next(error);
  }
}

async function updateItem(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Invalid item ID.'
      });
      return;
    }

    const validation = validateItem(req.body);

    if (!validation.isValid) {
      res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.errors
      });
      return;
    }

    const item = await itemService.updateItem(id, validation.value);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      data: item
    });
  } catch (error) {
    next(error);
  }
}

async function deleteItem(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Invalid item ID.'
      });
      return;
    }

    const deleted = await itemService.deleteItem(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await itemService.getStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getStats
};
