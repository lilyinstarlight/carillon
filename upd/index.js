var path = require('path');
var fs = require('fs');

var express = require('express');
var bodyParser = require('body-parser');
var yargs = require('yargs');

var argv = yargs
                .usage('Usage: $0 [-p <port>] [-a <address>]')
                .alias('p', 'port')
                .nargs('p', 1)
                .number('p')
                .default('p', 8081)
                .describe('p', 'Bind port')
                .alias('a', 'addr')
                .nargs('a', 1)
                .string('a')
                .default('a', '127.0.0.1')
                .describe('a', 'Bind address')
                .help('h')
                .alias('h', 'help')
                .argv;

var app = express();

app.use(bodyParser.json());

app.use(express.static('www'));

app.get('/metadata', function (req, res) {
  fs.readFile(path.join(__dirname, '..', 'www', 'stream', 'metadata.json'), function (err, data) {
    if (err) {
      console.error('Error reading file');
      res.status(500);
      res.send('{}');
    }
    else {
      res.contentType('application/json');
      res.send(data);
    }
  });
});

app.post('/metadata', function (req, res) {
  if ('title' in req.body && 'composer' in req.body && 'live' in req.body) {
    fs.writeFile(path.join(__dirname, '..', 'www', 'stream', 'metadata.json'), JSON.stringify({'title': req.body.title, 'composer': req.body.composer, 'live': req.body.live}), function (err) {
      if (err) {
        console.error('Error updating file');
        res.status(500);
      }

      res.send();
    });
  }
  else {
    res.status(400);
    res.send();
  }
});

app.listen(argv.port, argv.addr, function () {
  console.log('Carillon updater running...');
});
