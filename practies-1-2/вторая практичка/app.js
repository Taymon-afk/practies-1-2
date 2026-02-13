const express = require('express');
const app = express();
const port = 3000;

let items = [
    { id: 1, name: 'Кофе', price: 450 },
    { id: 2, name: 'Кружка', price: 350 },
    { id: 3, name: 'Чайник', price: 2100 }
];

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Магазин товаров');
});

app.get('/items', (req, res) => {
    res.json(items);
});

app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Товар не найден');
    }
});

app.post('/items', (req, res) => {
    const { name, price } = req.body;
    const newItem = {
        id: Date.now(),
        name,
        price
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.patch('/items/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    if (item) {
        const { name, price } = req.body;
        if (name !== undefined) item.name = name;
        if (price !== undefined) item.price = price;
        res.json(item);
    } else {
        res.status(404).send('Товар не найден');
    }
});

app.delete('/items/:id', (req, res) => {
    const initialLength = items.length;
    items = items.filter(i => i.id != req.params.id);
    
    if (items.length < initialLength) {
        res.send('Товар удален');
    } else {
        res.status(404).send('Товар не найден');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log('Доступные маршруты:');
    console.log('   GET    /            - главная');
    console.log('   GET    /items       - все товары');
    console.log('   GET    /items/:id   - товар по id');
    console.log('   POST   /items       - создать товар');
    console.log('   PATCH  /items/:id   - обновить товар');
    console.log('   DELETE /items/:id   - удалить товар');
});