const express = require("express");
const path = require("path");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const utils = require("./utils/formatDate");

const sequelize = require("./config/connection");
const routes = require("./controllers");

const app = express();
const PORT = process.env.PORT || 3001;

// initialize dotenv for secure connection
require("dotenv").config();

// setup session
const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // httpOnly: true,
    secure: false,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// initialize session
app.use(session(sess));

// setup handlebars as template engine
const handlebars = exphbs.create({ utils });
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.use(routes);
// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening on port " + PORT));
});
