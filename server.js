// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const http = require('http');
const showdown = require('showdown');
const path = require('path');
const server = http.Server(app);
const io = require('socket.io')(server);
const converter = new showdown.Converter();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/show.html');
});

app.get('/edit', function(request, response) {
  response.sendFile(__dirname + '/views/edit.html');
});

app.get('/api/updateSlide', (req, res) => {
  console.log(`[ server.js ] GET request to 'api/updateSlide' => ${JSON.stringify(req.query)}`);

  const { markdown } = req.query;

  if (markdown) {
    console.log("===");
    updateSlide(markdown);
    res.status(200).send(`Received 'updateSlide' request with: ${markdown}\n`);
  } else {
    res.status(400).send('Invalid parameters.\n');
  }
});

io.on('connection', (socket) => {
      console.log(`[server.js] ${socket.id} connected`);
      
      
  
      socket.on('disconnect', () => {
        console.log(`[server.js] ${socket.id} disconnected`);
      });
});

function updateSlide(markdown){
  io.emit('update slide', converter.makeHtml( markdown ) );
}



// listen for requests :)
const listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
