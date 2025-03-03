const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  timezone: '+03:00' // Укажите ваш часовой пояс
  });

const Request = sequelize.define('requests', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Новое',
  },
  solution: {
    type: DataTypes.TEXT,
  },
  cancellationReason: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  //tableName: 'requests', // Явно указываем имя таблицы
});

module.exports = { sequelize, Request };