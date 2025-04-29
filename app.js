const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Настройка шаблонизатора EJS
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware для парсинга JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
const appealRoutes = require('./routes/appealRoutes');
app.use('/all_appeal', appealRoutes);

// Старт сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});