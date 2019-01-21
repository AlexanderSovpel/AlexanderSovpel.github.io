const initialData = {
  coord: {
    lon: 27.56,
    lat: 53.9
  },
  weather: [
    {
      id: 803,
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04d'
    }
  ],
  base: 'stations',
  main: {
    temp: 2,
    pressure: 998,
    humidity: 94,
    temp_min: 2,
    temp_max: 2
  },
  visibility: 10000,
  wind: {
    speed: 5,
    deg: 210,
    gust: 8
  },
  clouds: {
    all: 75
  },
  dt: 1547816400,
  sys: {
    type: 1,
    id: 8939,
    message: 0.238,
    country: 'BY',
    sunrise: 1547792188,
    sunset: 1547821468
  },
  id: 625144,
  name: 'Minsk',
  cod: 200
};

const createApp = function() {
  'use strict';

  const app = {
    state: {
      ...initialData,
      isLoading: false,
    },

    components: {
      weatherForecast: {
        self: () => document.querySelector('#app > .weather-forecast'),
        header: {
          self: () => document.querySelector('#app > .weather-forecast > .header'),
          location: () => document.querySelector('#app > .weather-forecast > .header > .location'),
          date: () => document.querySelector('#app > .weather-forecast > .header > .date'),
        },
        weather: {
          self: () => document.querySelector('#app > .weather-forecast > .weather'),
          icon: () => document.querySelector('#app > .weather-forecast > .weather > .visual > .icon'),
          temperature: () => document.querySelector('#app > .weather-forecast > .weather > .visual > .temperature'),
          description: () => document.querySelector('#app > .weather-forecast > .weather > .description'),
        },
        updateButton: () => document.querySelector('#app > .weather-forecast > .update-button'),
      },
      loader: () => document.querySelector('#app > .loader'),
    },

    render() {
      if (this.state.isLoading) {
        this.components.weatherForecast.self().setAttribute('hidden', true);
        this.components.loader().removeAttribute('hidden');
      } else {
        this.components.loader().setAttribute('hidden', true);
        this.components.weatherForecast.self().removeAttribute('hidden');

        this.components.weatherForecast.header.location().innerHTML = `${this.state.name}, ${this.state.sys.country}`;
        this.components.weatherForecast.header.date().innerHTML = new Date(this.state.dt * 1000).toLocaleString();

        this.components.weatherForecast.weather.icon().className = `icon ${this.getWeatherIcon(this.state.weather[0].id)}`;
        this.components.weatherForecast.weather.temperature().innerHTML = this.state.main.temp;
        this.components.weatherForecast.weather.description().innerHTML = this.state.weather[0].main;
      }
    },

    getForecast() {
      this.state.isLoading = true;
      const url = 'https://api.openweathermap.org/data/2.5/weather?q=Minsk,by&appid=eefae3388620d9e23738898664eb2bd9&units=metric';
      const request = new XMLHttpRequest();

      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            const response = JSON.parse(request.response);

            this.state = {
              ...response,
              isLoading: false,
            };
            this.render();
          }
        } else {
          this.render();
        }
      };

      request.open('GET', url);
      request.send();
    },

    getWeatherIcon(id) {
      id = String(id);

      if (id.charAt(0) === '2') {
        return 'thunderstorm';
      }

      if (id.charAt(0) === '3') {
        if (id.charAt(1) === '0') {
          return 'scattered-showers';
        } else {
          return 'cloudy-scattered-showers';
        }
      }

      if (id.charAt(0) === '5') {
        if (id.charAt(1) === '0') {
          return 'rain';
        }
        if (id.charAt(1) === '1') {
          return 'sleet';
        }
        if (id.charAt(1) === '2') {
          return 'cloudy-scattered-showers';
        }
      }

      if (id.charAt(0) === '6') {
        if (id.charAt(1) === '0') {
          return 'show';
        } else {
          return 'sleet';
        }
      }

      if (id.charAt(0) === '7') {
        return 'fog';
      }

      if (id.charAt(0) === '8') {
        if (id.charAt(2) === '0') {
          return 'clear';
        }
        if (id.charAt(2) === '1' || id.charAt(2) === '2') {
          return 'partly-cloudy';
        } else {
          return 'cloudy';
        }
      }
    },
  };

  app.render = app.render.bind(app);
  app.getForecast = app.getForecast.bind(app);
  app.getWeatherIcon = app.getWeatherIcon.bind(app);

  app.components.weatherForecast.updateButton().addEventListener('click', app.getForecast);

  app.getForecast();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js')
    .then(() => console.log('ServiceWorker registered'))
    .catch(error => console.error(error.message));
  }

  return app;
};

window.addEventListener('load', () => {
  window.app = createApp();
});