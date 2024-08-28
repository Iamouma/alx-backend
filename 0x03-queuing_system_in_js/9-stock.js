// Required dependencies
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

// Initialize Express app
const app = express();
const port = 1245;

// List of products
const listProducts = [
  { itemId: 1, itemName: "Suitcase 250", price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: "Suitcase 450", price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: "Suitcase 650", price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: "Suitcase 1050", price: 550, initialAvailableQuantity: 5 },
];

// Create Redis client
const client = redis.createClient();

// Promisify Redis functions for async/await usage
const getAsync = promisify(client.get).bind(client);

// Function to get product by ID
function getItemById(id) {
  return listProducts.find(item => item.itemId === id);
}

// Function to reserve stock by item ID
const reserveStockById = (itemId, stock) => {
  client.set(`item.${itemId}`, stock);
};

// Function to get the current reserved stock by item ID
const getCurrentReservedStockById = async (itemId) => {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : null;
};

// Route to get the list of all products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route to get details of a specific product by ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: "Product not found" });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = currentStock !== null ? product.initialAvailableQuantity - currentStock : product.initialAvailableQuantity;

  res.json({ ...product, currentQuantity });
});

// Route to reserve a product by ID
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: "Product not found" });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = currentStock !== null ? product.initialAvailableQuantity - currentStock : product.initialAvailableQuantity;

  if (currentQuantity <= 0) {
    return res.json({ status: "Not enough stock available", itemId });
  }

  reserveStockById(itemId, (currentStock || 0) + 1);
  res.json({ status: "Reservation confirmed", itemId });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
