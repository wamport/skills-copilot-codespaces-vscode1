//Create web server

var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var comments = require('./comments');
var path = require('path');
var mime = require('mime');
var util = require('util');

var server = http.createServer(function(req, res) {
  var urlPath = url.parse(req.url).pathname;
  console.log('urlPath', urlPath);
  switch(urlPath) {
    case '/':
      serveStatic(res, 'public/index.html', 'text/html');
      break;
    case '/new':
      newComment(req, res);
      break;
    case '/comments':
      serveComments(res);
      break;
    default:
      serveStatic(res, 'public' + urlPath);
  }
});

function newComment(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    comments.add(fields.name, fields.comment, function(err) {
      if (err) {
        res.statusCode = 500;
        res.end('Server error');
        return;
      }
      serveComments(res);
    });
  });
}

function serveComments(res) {
  comments.all(function(err, data) {
    if (err) {
      res.statusCode = 500;
      res.end('Server error');
      return;
    }
    res.end(data);
  });
}

function serveStatic(res, file, type) {
  type = type || 'text/plain';
  fs.readFile(file, function(err, data) {
    if (err) {
      res.statusCode = 500;
      res.end('Server error');
      return;
    }
    res.setHeader('Content-Type', type);
    res.end(data);
  });
}

server.listen(8000, function() {
  console.log('Listening on http://localhost:8000');
});