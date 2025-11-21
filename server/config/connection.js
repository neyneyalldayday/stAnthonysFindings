require('dotenv').config();


const Sequelize = require('sequelize');

const sequelize = process.env.DB_URL
    ? new Sequelize(process.env.DB_URL, {
        dialectOptions: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            supportBigNumbers: true,
            bigNumberStrings: true 
        },
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci' 
        }
    })
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: 'postgres',
        dialectOptions: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            supportBigNumbers: true,
            bigNumberStrings: true,
            decimalNumbers: true,
        },
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci'
        }
    });

    sequelize.authenticate()
        .then(() => console.log('Database connected.'))
        .catch(err => console.error('Unable to connect to the database:', err));

    module.exports = sequelize;