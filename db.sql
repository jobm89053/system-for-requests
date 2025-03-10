CREATE TABLE Requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    status ENUM('Новое', 'В работе', 'Завершено', 'Отменено') DEFAULT 'Новое',
    solution TEXT,
    cancellationReason TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO Requests (topic, text, status, solution, cancellationReason, createdAt, updatedAt)
VALUES
('Ошибка в отчете', 'При экспорте в PDF некоторые данные теряются', 'Новое', NULL, NULL, '2024-02-01 10:15:00', '2024-02-01 10:15:00'),
('Проблема с входом', 'После обновления не могу войти в систему', 'В работе', NULL, NULL, '2024-02-02 09:30:00', '2024-02-05 14:22:00'),
('Сбой при загрузке файла', 'При загрузке документа выдает ошибку 500', 'Завершено', 'Исправлены настройки сервера', NULL, '2024-02-03 11:05:00', '2024-02-06 15:00:00'),
('Ошибка базы данных', 'Запрос выполняется слишком долго', 'Новое', NULL, NULL, '2024-02-04 16:40:00', '2024-02-04 16:40:00'),
('Проблема с отчетом', 'Некорректное отображение диаграмм', 'Отменено', NULL, 'Ошибка на стороне пользователя', '2024-02-05 08:20:00', '2024-02-07 12:45:00'),
('Недоступен сервер', 'Веб-приложение не загружается', 'В работе', NULL, NULL, '2024-02-06 07:55:00', '2024-02-08 09:30:00'),
('Ошибка авторизации', 'Пользователь не может сбросить пароль', 'Завершено', 'Исправлена логика восстановления пароля', NULL, '2024-02-07 10:10:00', '2024-02-09 11:45:00'),
('Не отправляются сообщения', 'Пользователи не получают уведомления', 'Новое', NULL, NULL, '2024-02-08 12:30:00', '2024-02-08 12:30:00'),
('Низкая скорость загрузки', 'Страницы загружаются более 10 секунд', 'В работе', NULL, NULL, '2024-02-09 14:45:00', '2024-02-11 17:20:00'),
('Ошибка в калькуляции', 'Неправильно рассчитывается скидка', 'Завершено', 'Обновлены формулы расчетов', NULL, '2024-02-10 09:10:00', '2024-02-12 12:10:00'),
('Проблема с доступами', 'Пользователь не видит нужные разделы', 'Новое', NULL, NULL, '2024-02-11 11:35:00', '2024-02-11 11:35:00'),
('Сбой интерфейса', 'Кнопки не реагируют на нажатие', 'Отменено', NULL, 'Проблема воспроизвести не удалось', '2024-02-12 13:20:00', '2024-02-14 14:00:00'),
('Ошибка печати', 'Печатается только половина документа', 'В работе', NULL, NULL, '2024-02-13 15:45:00', '2024-02-15 16:30:00'),
('Проблема с платежами', 'Оплаты не проходят через PayPal', 'Завершено', 'Исправлен API интеграции с PayPal', NULL, '2024-02-14 08:10:00', '2024-02-16 10:00:00'),
('Ошибка отображения', 'Некорректно отображаются графики', 'Новое', NULL, NULL, '2024-02-15 17:25:00', '2024-02-15 17:25:00'),
('Сбой отправки email', 'Письма не доходят до пользователей', 'В работе', NULL, NULL, '2024-02-16 07:30:00', '2024-02-18 09:40:00'),
('Ошибка в отчетах', 'Некорректные данные в финансовом отчете', 'Завершено', 'Исправлен расчет финансовых показателей', NULL, '2024-02-17 10:50:00', '2024-02-19 12:55:00'),
('Не работает кнопка "Назад"', 'После обновления пропала навигация', 'Отменено', NULL, 'Клиент отказался от исправления', '2024-02-18 14:00:00', '2024-02-20 15:30:00'),
('Ошибка базы данных', 'Система зависает при большом количестве данных', 'В работе', NULL, NULL, '2024-02-19 08:25:00', '2024-02-21 11:10:00'),
('Некорректное отображение таблицы', 'Столбцы смещены в мобильной версии', 'Завершено', 'Исправлены CSS стили', NULL, '2024-02-20 13:10:00', '2024-02-22 14:40:00'),
('Ошибка логина', 'Пользователь вводит верные данные, но не входит', 'Новое', NULL, NULL, '2024-02-21 09:00:00', '2024-02-21 09:00:00'),
('Проблема с API', 'Запросы возвращают 403 ошибку', 'В работе', NULL, NULL, '2024-02-22 11:20:00', '2024-02-24 13:15:00'),
('Ошибка генерации документов', 'Документы скачиваются пустыми', 'Завершено', 'Обновлен механизм рендеринга', NULL, '2024-02-23 15:35:00', '2024-02-25 17:50:00'),
('Не загружаются файлы', 'Прикрепленные файлы не появляются в системе', 'Отменено', NULL, 'Пользователь использовал неподдерживаемый формат', '2024-02-24 10:10:00', '2024-02-26 11:45:00'),
('Сбой в расчетах', 'Неправильное округление сумм', 'В работе', NULL, NULL, '2024-02-25 07:55:00', '2024-02-27 09:30:00'),
('Ошибка в формировании отчетов', 'Некорректные фильтры в отчете', 'Завершено', 'Исправлена логика фильтрации', NULL, '2024-02-26 12:45:00', '2024-02-28 14:20:00'),
('Не работает поиск', 'Фильтрация не применяется к данным', 'Новое', NULL, NULL, '2024-02-27 09:35:00', '2024-02-27 09:35:00'),
('Ошибка в мобильной версии', 'Кнопки перекрываются друг с другом', 'В работе', NULL, NULL, '2024-02-28 14:10:00', '2024-03-02 16:30:00'),
('Не приходит SMS-код', 'Двухфакторная аутентификация не работает', 'Завершено', 'Исправлен сервис отправки SMS', NULL, '2024-02-29 07:20:00', '2024-03-03 09:55:00'),
('Ошибка обновления профиля', 'Изменения не сохраняются', 'Отменено', NULL, 'Проблема возникла из-за устаревшей версии браузера', '2024-03-01 11:00:00', '2024-03-03 12:40:00');