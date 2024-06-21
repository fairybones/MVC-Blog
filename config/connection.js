// import necessary packages for connection pool
const Sequelize = require('sequelize');
// environment variables
require('dotenv').config();

// initialize server connection
const sequelize = process.env.DB_URL
? new Sequelize(process.env.DB_URL)
: new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: 'localhost',
        dialect: 'postgres',
    }
);

// export sequelize connection to be used elsewhere
module.exports = sequelize;