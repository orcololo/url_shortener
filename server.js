'use strict';
const Datastore = require('nedb'), db = new Datastore({filename: '.data/datafile', autoload: true});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const url = require('url');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));
app.use(function(req, res, next) {
    console.log(req.method + " " + req.path + " - " + req.ip + " - " + req.url);
    next();
});

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
    res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function (req, res) {
    console.log(req.body);
    console.log(req.params);
});

app.listen(port, function () {
    console.log(`Express is listening on port ${port}.`);
});
