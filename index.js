'use strict';

const fs = require('fs'),
    http = require('http'),
    path = require('path');

const { createTerminus, HealthCheckError } = require('@godaddy/terminus');


function onSignal () {
  console.log('server is starting cleanup');
  return Promise.all([
    // your clean logic, like closing database connections
  ]);
}

function beforeShutdown(){
   // given your readiness probes run every 5 second
  // may be worth using a bigger number so you won't
  // run into any race conditions
  return new Promise(resolve => {
    setTimeout(resolve, 5000)
  })
}

function onShutdown () {
  console.log('cleanup finished, server is shutting down');
}

function healthCheck () {
  return Promise.resolve(
    // optionally include a resolve value to be included as
    // info in the health check response
  )
}

const options = {
  healthChecks: {
    '/healthz': healthCheck,
    verbatim: true
  },
  onSignal,                     
  onShutdown,
  beforeShutdown                  
};

var express = require("express");
var app = express();
app.get('/', (req, res) => {
  res.send('ok');
});
var bodyParser = require('body-parser');
app.use(bodyParser.json({
  strict: false
}));

const { createMiddleware, getSummary, getContentType } = require('@promster/express');
app.use(createMiddleware({ app }));

app.use('/metricsz', (req, res) => {
  req.statusCode = 200;
  res.setHeader('Content-Type', getContentType());
  res.end(getSummary());
});

var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = 8080;

var spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

var options_object = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true
};

oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() {
  var server = http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
    if (options_object.docs !== false) {
      console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      console.log("________________________________________________________________");
    }
  });
  createTerminus(server, options);
});

app.get('/infoz', function(req, res) {
  res.send({
    info: "This API was generated using oas-generator!",
    name: oasDoc.info.title,
    version: "booboo"
  });
});
