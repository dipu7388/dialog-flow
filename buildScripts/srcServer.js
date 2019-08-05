import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';
import unirest from 'unirest'

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/users', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    {"id": 1,"firstName":"Bob","lastName":"Smith","email":"bob@gmail.com"},
    {"id": 2,"firstName":"Tammy","lastName":"Norton","email":"tnorton@yahoo.com"},
    {"id": 3,"firstName":"Tina","lastName":"Lee","email":"lee.tina@hotmail.com"}
  ]);
});

app.get('/name', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    {"id": 1,"firstName":"Dheerendra","lastName":"Singh","email":"aaaa7388@gmail.com"}
  ]);
});

app.get('/dk',  function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real database
  console.log(req,res);
  res.json([
    {"id": 1,"firstName":"Dheerendra","lastName":"Singh","email":"aaaa7388@gmail.com"}
  ]);});

app.get('/getMovies',function (request,response)  {
  if(request.body.result.parameters['top-rated']) {
      var req = unirest("GET", "https://localhost:3000/users");
          req.query({
              "page": "1",
              "language": "en-US",
              "api_key": ""
          });
          req.send("{}");
          req.end(function(res) {
              if(res.error) {
                  response.setHeader('Content-Type', 'application/json');
                  response.send(JSON.stringify({
                      "speech" : "Error. Can you try it again ? ",
                      "displayText" : "Error. Can you try it again ? "
                  }));
              } else if(res.body.results.length > 0) {
                  let result = res.body.results;
                  let output = '';
                  for(let i = 0; i<result.length;i++) {
                      output += result[i].title;
                      output+="\n"
                  }
                  response.setHeader('Content-Type', 'application/json');
                  response.send(JSON.stringify({
                      "speech" : output,
                      "displayText" : output
                  }));
              }
          });
  }
});



app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open('https://lsnetx-chatbot.herokuapp.com' + port);
  }
});
