const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/f4b864da551d9fc5fff3d401f2bc13a4/${latitude},${longitude}?units=ca`;
  request(
    {
      url,
      json: true
    },
    (error, { body }) => {
      if (error) {
        callback('Unable to connect to weather service!', undefined);
      } else if (body.error) {
        callback('Unable to find location.', undefined);
      } else {
        callback(undefined, {
          summary: body.daily.data[0].summary,
          temperature: body.currently.temperature,
          precipitation: body.currently.precipProbability
        });
      }
    }
  );
};

module.exports = forecast;
