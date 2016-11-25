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


// Routing
app.get('/', (request, response) => {
  eval(pry.it)
  response.render('home', {
    name: 'John',
    surname: 'Vogel'
  })
})




// Error catching
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
