const express = require("express");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const router = express.Router();

router.get("/", (req, res) => {
    res.render('index');
});

router.post("/", (req, res) => {
    if (req.body.val) {
        db.query('SELECT * FROM sofs WHERE DAD_DA_Reference LIKE ?', [req.body.val + "%"], (err, result) => {
            if (err)
                console.log(err);
            else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result))
            }
        });
    }
});

router.get("/all", (req, res) => {
    db.query('SELECT * FROM sofs', (err, result) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result))
    })
});

module.exports = router;