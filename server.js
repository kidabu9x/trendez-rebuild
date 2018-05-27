const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
let app = express();
app.use(history())
app.use(serveStatic(path.join(__dirname + '/dist')));
app.get('/', function (req, res) {
    res.render(path.join(__dirname + '/dist/index.html'));
});
var port = process.env.PORT || 5000;
app.listen(port);
console.log('Server started '+ port);