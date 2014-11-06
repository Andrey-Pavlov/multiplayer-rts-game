var http = require('http');
var path = require('path');

var express = require('express');
var app = express();

app.use(express.static(path.resolve(__dirname, 'client')));
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");