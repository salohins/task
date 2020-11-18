const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const router = express.Router();

router.get("/fill", (req, res) => { // Filling tables with data
    var fs = require('fs');
    var data = fs.readFileSync('./config/data/sofs_data.csv')
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e => e.trim()));

    for (var i = 1; i < data.length - 1; i++) {
        const datetime = data[i][data[i].length - 1].split(" ");
        const date = datetime[0].split("/");
        const datetimeVal = (date[2] + "-" + date[0] + "-" + date[1] + " " + datetime[1] + ":00");        

        db.query('INSERT INTO sofs (ID,DAD_DA_Reference,MODIFIED_DTG) VALUES (?, ?, ?)', 
            [data[i][0],data[i][1], datetimeVal], (err, res) => {
                if (err) 
                    console.log(err);                
        });
    }

    data = fs.readFileSync('./config/data/sof_events_data.csv')
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e => e.trim()));

    for (var i = 1; i < data.length - 1; i++) {
        const datetime = data[i][data[i].length - 1].split(" ");
        const date = datetime[0].split("/");
        const datetimeVal = (date[2] + "-" + date[0] + "-" + date[1] + " " + datetime[1] + ":00");        

        db.query('INSERT INTO sof_events (ID,SOF_ID,ORIGINAL_EVENT,STD_EVENT_CODE,DATE_TIME) VALUES (?, ?, ?, ?, ?)', 
            [data[i][0],data[i][1], data[i][2], data[i][3], datetimeVal], (err, res) => {
                if (err) 
                    console.log(err);                
        });
    }

    data = fs.readFileSync('./config/data/standart_events_data.csv')
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e => e.trim()));

    for (var i = 1; i < data.length - 1; i++) {     
        db.query('INSERT INTO standart_events (STD_EVENT_CODE,STD_EVENT_NAME) VALUES (?, ?)', 
            [data[i][0],data[i][1].trim()], (err, res) => {
                if (err) 
                    console.log(err);                
        });
    }

    res.end();
});

router.post('/', (req, res) => {
    if (req.body.select)
        res.redirect('/sofs/' + req.body.select);
    else 
        res.redirect('/');
});

router.get('/:id', (req, res) => {    
    res.render("index", {sof: req.params.id});
});

router.post('/data', (req, res) => {    
    db.query("SELECT * FROM sofs where DAD_DA_Reference = ?", [req.body.sofNo], (err, result) => {
        if (err)
            console.log(err);
        else 
            db.query("SELECT a.DATE_TIME, a.ORIGINAL_EVENT, a.STD_EVENT_CODE, b.STD_EVENT_NAME FROM sof_events a, standart_events b WHERE a.SOF_ID = ? AND b.STD_EVENT_CODE = a.STD_EVENT_CODE",
                [result[0].ID], (err2, result2) => {
                    if (err2)
                        console.log(err2);
                    else 
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result2));
                })
    });    
});
module.exports = router;