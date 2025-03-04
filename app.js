const express = require('express');
const { sequelize } = require('./models');
const requestController = require('./controllers/requestController');
const appealSolutionRouter = require('./routes/appeal_solution'); // Маршруты для решения обращений
const appealDetailsRouter = require('./routes/appeal_details'); // Маршруты для деталей обращения


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
app.get('/create_appeal', (req, res) => {
  res.render('create_appeal', { title: 'Создать обращение' }); // Форма создания обращения
});
app.post('/create_appeal', requestController.create_appeal); // Обработка создания обращения

// Подключение маршрутов из appeal_solution.js
app.use('/appeal_solution', appealSolutionRouter);

// Подключение маршрутов из appeal_details.js
app.use('/appeal_details', appealDetailsRouter); // Подключаем маршруты для деталей обращения

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

app.post('/cancel_all_in_progress', requestController.cancelAllInProgress);

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
