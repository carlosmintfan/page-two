
/**
 * Module dependencies.
 */

var express = require('express')
  , join = require('path').join
  , fs = require('fs');

var app = express();


// deprecated express methods
// app.use(express.favicon());
// app.use(express.logger('dev'));

app.set('views', __dirname);
app.set('view engine', 'pug');
app.enable('strict routing');

// load examples

var examples = fs.readdirSync(__dirname).filter(function(file){
  return fs.statSync(__dirname + '/' + file).isDirectory();
});

// routes

/**
 * GET page.js
 */

app.get('/page.js', function(req, res){
  res.sendFile(join(__dirname, '..', 'page.js'));
});

/**
 * GET test libraries.
 */

app.get(/^\/(mocha|chai)\.(css|js)$/i, function(req, res){
  res.sendFile(join(__dirname, '../test/', req.params.join('.')));
});

/**
 * GET list of examples.
 */

app.get('/', function(req, res){
  res.render('list', { examples: examples });
});

/**
 * GET /:example -> /:example/
 */

app.get('/:example', function(req, res){
  res.redirect('/' + req.params.example + '/');
});

/**
 * GET /:example/* as a file if it exists.
 */

app.get('/:example/:file(*)', function(req, res, next){
  var file = req.params.file;
  if (!file) return next();
  var name = req.params.example;
  var path = join(__dirname, name, file);
  fs.stat(path, function(err, stat){
    if (err) return next();
    res.sendFile(path);
  });
});

/**
 * GET /:example/* as index.html
 */

app.get('/:example/*', function(req, res){
  var name = req.params.example;
  res.sendFile(join(__dirname, name, 'index.html'));
});

app.listen(4000);
console.log('Example server listening on port 4000');
