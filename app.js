const express = require('express');
const { sequelize } = require('./models');
const requestController = require('./controllers/requestController');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка шаблонизатора Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Маршруты для работы с обращениями
app.get('/all_appeal', requestController.getAllRequests); // Получить все обращения
app.get('/all_appeal/filter', requestController.getAllRequests); // Фильтрация по дате или диапазону дат
app.post('/create_appeal', requestController.createRequest); // Создать новое обращение

// Главная страница
app.get('/', (req, res) => {
  res.redirect('/all_appeal');
});

// Обработка ошибок
app.use((req, res) => {
  res.status(404).render('404', { title: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Ошибка сервера' });
});

// Синхронизация с базой данных и запуск сервера
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка при синхронизации с базой данных:', error);
  });