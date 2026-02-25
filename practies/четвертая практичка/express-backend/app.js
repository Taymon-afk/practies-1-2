const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const port = 3000;

let products = [
  { id: nanoid(6), name: 'Ноутбук Asus', category: 'Ноутбуки', description: '15.6", 8GB RAM, 512GB SSD', price: 55000, stock: 5 },
  { id: nanoid(6), name: 'Ноутбук HP', category: 'Ноутбуки', description: '14", 16GB RAM, 1TB SSD', price: 72000, stock: 3 },
  { id: nanoid(6), name: 'Смартфон Samsung', category: 'Смартфоны', description: '6.5", 128GB', price: 35000, stock: 8 },
  { id: nanoid(6), name: 'Смартфон Xiaomi', category: 'Смартфоны', description: '6.3", 64GB', price: 18000, stock: 12 },
  { id: nanoid(6), name: 'Наушники Sony', category: 'Аудио', description: 'Bluetooth, шумоподавление', price: 8500, stock: 15 },
  { id: nanoid(6), name: 'Клавиатура Logitech', category: 'Аксессуары', description: 'механическая, RGB', price: 4500, stock: 7 },
  { id: nanoid(6), name: 'Монитор LG', category: 'Мониторы', description: '27", 4K, IPS', price: 28000, stock: 4 },
  { id: nanoid(6), name: 'Мышь Razer', category: 'Аксессуары', description: 'игровая, 16000 DPI', price: 3200, stock: 9 },
  { id: nanoid(6), name: 'Планшет iPad', category: 'Планшеты', description: '10.2", 64GB', price: 29000, stock: 6 },
  { id: nanoid(6), name: 'Внешний диск', category: 'Хранение', description: '1TB, USB 3.0', price: 4200, stock: 11 }
];

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' }));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${res.statusCode} ${req.path}`);
  });
  next();
});

function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Товар не найден' });
    return null;
  }
  return product;
}

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock } = req.body;
  
  if (!name || !category || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock)
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  
  const { name, category, description, price, stock } = req.body;
  
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  
  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Товар не найден' });
  
  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
  console.log(`✅ Сервер запущен на http://localhost:${port}`);
  console.log(`📦 Товаров в базе: ${products.length}`);
});