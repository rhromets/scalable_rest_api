const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');

const sequelize = Sequelize(config[env]);

module.exports = sequelize;