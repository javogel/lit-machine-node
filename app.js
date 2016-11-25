require('./app/index')

const pry = require('pryjs')
const express = require('express')
const app = express()
const port = 3000

// Setting handlebar template helper
const path = require('path');
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))


// Middle-Ware-ing
var textTransform = function (req, res, next) {
  var rita = require('rita');
  var fs = require('fs');

  fs.readFile('app/data/meditations.txt', function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
    // for(i in array) {
    //     console.log(array[i]);
    // }
    var markov = new rita.RiMarkov(3);
    markov.loadText(array.join(' '));
    req.variable = markov.generateSentences(50);
    next()
  });
  // eval(pry.it)
  // var rs = rita.RiString("The elephant took a bite!");
  // req.variable = rs;
  // console.log(rs.features());
}

app.use(textTransform)
// Routing
app.get('/', (request, response) => {
  // eval(pry.it)
  response.render('home', {
    phrase: request.variable[Math.floor(Math.random() * request.variable.length)]
  })
})




// Error catching
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
