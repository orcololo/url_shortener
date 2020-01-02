'use strict';
const gfynonce = require('gfynonce');
const Datastore = require('nedb'), db = new Datastore({filename: '.data/datafile', autoload: true});
const express = require('express');
const cors = require('cors');
const check_url = require('url');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));
app.use(function (req, res, next) {
    console.log(req.method + " " + req.path + " - " + req.ip + " - " + req.url);
    next();
});
app.use(express.urlencoded({extended: false}));
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
    res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function (req, res) {
        var {url} = req.body;
        var result = check_url.parse(url);
        var gfyString = gfynonce({adjectives: 1, separator: ''});
        if (result.hostname !== null) {
            try {
                var shortned = {
                    url: url,
                    short: gfyString
                };
                db.insert(shortned, function (err, doc) {
                    res.send({
                        "test": doc.url,
                        "short_url": doc.short
                    })
                });
            } catch (err) {
                res.send({"error": "url param not provided"})
            }
        } else {
            res.send({"error": 'invalid URL'})
        }
    }
);

app.get("/api/shorturl/:url", function (req, res) {
    db.findOne({short: req.params.url}, function (err, doc) {
        try {
            res.redirect(doc.url)
        } catch(err) {
            res.send({"error": "cannot find url you are looking for"})
        }
    });
});

app.listen(port, function () {
    console.log(`Express is listening on port ${port}.`);
});
