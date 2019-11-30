var path = require('path');
var fs = require('fs');

var express = require('express');
var bodyParser = require('body-parser');
var yargs = require('yargs');

var argv = yargs
                .usage('Usage: $0 [-p <port>] [-b <address>]')
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
                .alias('b', 'base')
                .nargs('b', 1)
                .string('b')
                .default('b', '/')
                .describe('b', 'Base path')
                .alias('r', 'proxy')
                .nargs('r', 1)
                .string('r')
                .default('r', null)
                .describe('r', 'Reverse proxy server address(es)')
                .help('h')
                .alias('h', 'help')
                .argv;

var app = express();
var router = express.Router();

router.use(express.static('www'));

router.get('/metadata', function (req, res) {
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

router.post('/metadata', bodyParser.json(), function (req, res) {
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

app.use(argv.base, router);
if (argv.proxy)
  app.set('trust proxy', argv.proxy);

app.listen(argv.port, argv.addr, function () {
  console.log('Carillon updater running...');
});
