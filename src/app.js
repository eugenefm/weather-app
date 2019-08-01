const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Eugene Michasiw'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Eugene Michasiw'
  });
});
app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'Here is some help text.',
    name: 'Eugene Michasiw'
  });
});

app.get('/weather', (req, res) => {
  let address = req.query.address;
  if (!address) {
    return res.send({
      error: 'You must provide an address.'
    });
  }

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(
      latitude,
      longitude,
      (error, { summary, temperature, precipitation } = {}) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          address: address,
          location,
          forcast: `${summary} It is currently ${temperature} degrees out. There is a ${precipitation}% chance of rain.`
        });
      }
    );
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term.'
    });
  }
  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'Help',
    message: 'Help article not found.',
    name: 'Eugene Michasiw'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404 Error',
    message: 'Page not found.',
    name: 'Eugene Michasiw'
  });
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
// app.com
// app.com/help
// app.com/about
