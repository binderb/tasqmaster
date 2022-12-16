const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
require("dotenv").config();

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // expires after 24 hours
    httpOnly: true,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Enable modular routes
app.use(routes);
// Provide catch-all routes
app.get("*", (req, res) => {
  res.status(404).render("404", {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id,
    username: req.session.username,
  });
});
app.post("*", (req, res) => {
  res
    .status(405)
    .json({ message: "Route not found, or HTTP method not allowed." });
});
app.put("*", (req, res) => {
  res
    .status(405)
    .json({ message: "Route not found, or HTTP method not allowed." });
});
app.delete("*", (req, res) => {
  res
    .status(405)
    .json({ message: "Route not found, or HTTP method not allowed." });
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
