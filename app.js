const express = require('express');
const { sequelize } = require('./models');
const requestController = require('./controllers/requestController');
const appealSolutionRouter = require('./routes/appeal_solution');
const appealDetailsRouter = require('./routes/appeal_details');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Маршруты для работы с обращениями
app.get('/all_appeal', requestController.getAllRequests);
app.get('/all_appeal/filter', requestController.getAllRequests);
app.get('/create_appeal', (req, res) => {
  res.render('create_appeal', { title: 'Создать обращение' });
});
app.post('/create_appeal', requestController.create_appeal);

// Маршрут для отмены всех обращений "В работе"
app.post('/cancel_all_in_progress', requestController.cancelAllInProgress);

// Подключение маршрутов из appeal_solution.js и appeal_details.js
app.use('/appeal_solution', appealSolutionRouter);
app.use('/appeal_details', appealDetailsRouter);

app.get('/', (req, res) => {
  res.redirect('/all_appeal');
});

app.use((req, res) => {
  res.status(404).render('404', { title: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Ошибка сервера' });
});

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка при синхронизации с базой данных:', error);
  });