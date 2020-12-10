const express = require('express')
const path = require("path");
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const get_quotes = require('./getQuotes');
const site_handler = require('./siteHandler')

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.set('views', './views')

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
})

app.post("/search-match", (req, res) => {
    search_string = req.body.search_string
    let content = 'You searched: ' + search_string
    get_quotes.getAllOdds(search_string, res)
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})