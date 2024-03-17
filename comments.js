//create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var comments = [];

http.createServer(function(req, res) {
    //parse the url
    var urlObj = url.parse(req.url, true);
    if (urlObj.pathname === '/') {
        fs.readFile('index.html', function(err, data) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end(err);
            }
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(data);
        });
    } else if (urlObj.pathname === '/comment') {
        //get the data
        var data = urlObj.query;
        comments.push(data);
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(comments));
    } else {
        fs.readFile(urlObj.pathname.substring(1), function(err, data) {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.end('Page not found');
            }
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(data);
        });
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');