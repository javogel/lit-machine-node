require('./app/index')

const pry = require('pryjs')
const express = require('express')
const app = express()
const port = 3000

// Setting handlebar template helper
const path = require('path');
const exphbs = require('express-handlebars');

app.set('port', (process.env.PORT || port))
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))

// Middle-Ware-ing
var textTransform = function (req, res, next) {
  var rita = require('rita');
  var fs = require('fs');

  fs.readFile('app/data/kafka.txt', function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
    var markov = new rita.RiMarkov(3);
    markov.loadText(array.join(' '));
    req.variable = markov.generateSentences(50);
    next()
  });
}

var getLines = function (request, res, next) {
  var rita = require('rita');
  var fs = require('fs');
  var source_url = ''

  if(request.params.source){
    source_url = 'app/data/' + request.params.source + '.txt'
  } else {
    console.log('where da source at?')
  }

  fs.readFile( source_url, function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
    var markov = new rita.RiMarkov(3);
    markov.loadText(array.join(' '));
    request.variable = markov.generateSentences(1);
    next()
  });
}

// Routing
app.get('/', textTransform, (request, response) => {
  // eval(pry.it)
  response.render('home', {
    phrase: request.variable[Math.floor(Math.random() * request.variable.length)]
  })
})





app.get('/get-lines/:source', getLines, (request, response) => {

  response.json(request.variable);

})

// Error catching

app.listen(app.get('port'), function(err) {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log("Node app is running at:" + app.get('port'))
})
