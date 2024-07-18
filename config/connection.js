// import necessary packages for connection pool
const { Sequelize } = require("sequelize");
// environment variables
require("dotenv").config();

// initialize connection
// const sequelize = process.env.DB_URL
//   ? new Sequelize(process.env.DB_URL)
//   : new Sequelize(
//       process.env.DB_NAME,
//       process.env.DB_USER,
//       process.env.DB_PASSWORD,
//       {
//         host: "localhost",
//         dialect: "postgres",
//         port: "5432",
//       }
//     );
let sequelize = new Sequelize({
  dialect: "postgres",
  port: 3001,
  database: "blog_db",
  username: "postgres",
  password: "wOw111!",
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Sequelize connection is ready!");
  })
  .catch((err) => {
    console.error("Unable to connect:", err);
  });

// export sequelize connection to be used elsewhere
module.exports = sequelize;
