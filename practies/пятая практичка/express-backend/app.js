const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API интернет-магазина',
      version: '1.0.0',
      description: 'API для управления товарами в интернет-магазине',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер',
      },
    ],
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Название товара
 *           example: "Ноутбук Asus"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Ноутбуки"
 *         description:
 *           type: string
 *           description: Описание товара
 *           example: "15.6\", 8GB RAM, 512GB SSD"
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *           example: 55000
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *           example: 5
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 *           example: "Товар не найден"
 */


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список всех товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новый товар"
 *               category:
 *                 type: string
 *                 example: "Электроника"
 *               description:
 *                 type: string
 *                 example: "Описание товара"
 *               price:
 *                 type: number
 *                 example: 9999
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новое название"
 *               category:
 *                 type: string
 *                 example: "Новая категория"
 *               description:
 *                 type: string
 *                 example: "Новое описание"
 *               price:
 *                 type: number
 *                 example: 9999
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Товар обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  const { name, category, description, price, stock } = req.body;
  
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  
  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/products/:id', (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  
  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
  console.log(`✅ Сервер запущен на http://localhost:${port}`);
  console.log(`📦 Товаров в базе: ${products.length}`);
  console.log(`📚 Документация Swagger: http://localhost:${port}/api-docs`);
});