const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({ path: './config/.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const publicDir = path.join(__dirname, "./public");
app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");

db.connect( (err) => {
    if (err)
        console.log(err);
    else {
        console.log("MYSQL Connected...");
    }
});

//Define Routes
app.use('/', require('./routes/select'));
app.use('/sofs', require('./routes/sofs'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));