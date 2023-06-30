const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const supplier = require("./app/controller/supplier.controller");
const app = express();
const mustacheExpress = require("mustache-express")
const favicon = require('serve-favicon');

// test MySQL connection section

const mysql = require("mysql2");
const config = require("./app/config/config.js");
const dbConfig = {
  host: config.APP_DB_HOST,
  port: config.APP_DB_PORT,
  user: config.APP_DB_USER,
  password: config.APP_DB_PASSWORD,
  database: config.APP_DB_NAME
};

// Create a MySQL pool to handle connections
const pool = mysql.createPool(dbConfig);

// test MySQL connection section

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.options("*", cors());
app.engine("html", mustacheExpress())
app.set("view engine", "html")
app.set("views", __dirname + "/views")
app.use(express.static('public'));
app.use(favicon(__dirname + "/public/img/favicon.ico"));

// APP endpoints
// list all the suppliers
app.get("/", (req, res) => {
    res.render("home", {});
});
app.get("/suppliers/", supplier.findAll);
// show the add suppler form
app.get("/supplier-add", (req, res) => {
    res.render("supplier-add", {});
});
// receive the add supplier POST
app.post("/supplier-add", supplier.create);
// show the update form
app.get("/supplier-update/:id", supplier.findOne);
// receive the update POST
app.post("/supplier-update", supplier.update);
// receive the POST to delete a supplier
app.post("/supplier-remove/:id", supplier.remove);

// MySQL database test endpoint
app.get('/entries', (req, res) => {
  // Acquire a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.status(500).json({ error: 'Error connecting to the database' });
      return;
    }
    // Execute the query to retrieve all entries
    connection.query('SELECT * FROM suppliers', (err, results) => {
      // Release the connection back to the pool
      connection.release();
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }
      // Return the entries as a JSON response
      res.json(results);
    });
  });
});

// handle 404
app.use(function (req, res, next) {
    res.status(404).render("404", {});
});


// set port, listen for requests
const app_port = process.env.APP_PORT || 3000
app.listen(app_port, () => {
    console.log(`Server is running on port ${app_port}.`);
});
