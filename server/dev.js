var
  path     = require('path'),
  express  = require('express'),
  app      = express(),
  compress = require('compression'),
  logger = require('morgan');



app.use(compress());

app.use(logger());

app.use("/scripts", express.static(__dirname + "/../app/scripts"));
app.use("/bower_components", express.static(__dirname + "/../bower_components"));
app.use("/images", express.static(__dirname + "/../app/images"));
app.use("/styles", express.static(__dirname + "/../app/styles"));
//app.use("/styles/fonts", express.static(__dirname + "/../app/styles/fonts"));
app.use("/fonts", express.static(__dirname + "/../app/fonts"));

app.all('/*', function (req, res) {
  res.sendFile('index.html', {root: __dirname + '/../app/'});
});

var server = app.listen(process.env.PORT || 3000, function () {

  var
    host = server.address().address,
    port = server.address().port;

  console.log('Here webchallenge listening at http://%s:%s', host, port);

});
