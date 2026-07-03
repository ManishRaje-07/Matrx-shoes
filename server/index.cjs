const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root welcome status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'MartX Premium E-Commerce API is fully operational',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      contact: '/api/contact',
      newsletter: '/api/newsletter'
    }
  });
});

// Helper functions to read/write JSON DB files
const readDb = (fileName) => {
  const filePath = path.join(__dirname, 'db', fileName);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf8');
      return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error(`Error reading database file: ${fileName}`, err);
    return [];
  }
};

const writeDb = (fileName, data) => {
  const filePath = path.join(__dirname, 'db', fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing database file: ${fileName}`, err);
    return false;
  }
};

// 1. Products API
app.get('/api/products', (req, res) => {
  try {
    const productsPath = path.join(__dirname, 'products.json');
    const rawData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(rawData);
    res.json(products);
  } catch (err) {
    console.error('API Error: /api/products', err);
    res.status(500).json({ error: 'Failed to read products database' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productsPath = path.join(__dirname, 'products.json');
    const rawData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(rawData);
    const product = products.find((p) => p.id === id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error(`API Error: /api/products/${req.params.id}`, err);
    res.status(500).json({ error: 'Failed to read products database' });
  }
});

// 2. Authentication API
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readDb('users.json');
  const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

  if (userExists) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    password, // Stored as plain text for simple local simulation
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeDb('users.json', users);

  res.status(201).json({
    email: newUser.email,
    token: `simulated-jwt-token-${newUser.id}`,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readDb('users.json');
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  res.json({
    email: user.email,
    token: `simulated-jwt-token-${user.id}`,
  });
});

// 3. Orders API
app.post('/api/orders', (req, res) => {
  const { email, items, subtotal, discount, shipping, tax, total } = req.body;
  if (!email || !items || !items.length) {
    return res.status(400).json({ error: 'Missing order parameters' });
  }

  const orders = readDb('orders.json');
  const newOrder = {
    id: `MTX-${Math.floor(100000 + Math.random() * 900000)}`,
    email: email.toLowerCase(),
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    date: new Date().toISOString(),
    status: 'Processing',
  };

  orders.push(newOrder);
  writeDb('orders.json', orders);

  res.status(201).json(newOrder);
});

app.get('/api/orders/user/:email', (req, res) => {
  const email = req.params.email;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const orders = readDb('orders.json');
  const userOrders = orders.filter((o) => o.email.toLowerCase() === email.toLowerCase());
  res.json(userOrders);
});

// 4. Contact Message API
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const contacts = readDb('contacts.json');
  const newContact = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    subject,
    message,
    date: new Date().toISOString(),
  };

  contacts.push(newContact);
  writeDb('contacts.json', contacts);

  res.status(201).json({ success: true, message: 'Contact entry logged' });
});

// 5. Newsletter Subscription API
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const newsletter = readDb('newsletter.json');
  const alreadySubscribed = newsletter.some(
    (n) => n.email.toLowerCase() === email.toLowerCase()
  );

  if (alreadySubscribed) {
    return res.status(400).json({ error: 'Email is already subscribed' });
  }

  const newSub = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    date: new Date().toISOString(),
  };

  newsletter.push(newSub);
  writeDb('newsletter.json', newsletter);

  res.status(201).json({ success: true, message: 'Newsletter subscription logged' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`[Express Backend] API server running on http://localhost:${PORT}`);
});
