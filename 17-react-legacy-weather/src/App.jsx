import { Component } from "react";

import { convertToFlag } from "./utils";

import Input from "./components/Input";
import Loader from "./components/Loader";
import Weather from "./components/Weather";

class App extends Component {
  state = {
    location: "",
    displayLocation: "",
    weather: {},
    isLoading: false,
  };
  timer = null;

  fetchWeather = async () => {
    try {
      this.setState({ isLoading: true });

      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);

      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();

      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleLocationChange = (e) => {
    this.setState({ weather: {} });
    this.setState({ location: e.target.value });
  };

  componentDidMount() {
    this.setState({ location: localStorage.getItem("location") || "" });
  }

  componentDidUpdate(_, prevState) {
    const curLocation = this.state.location;

    if (curLocation !== prevState.location) {
      if (this.timer) clearTimeout(this.timer);
      if (curLocation.length > 1)
        this.timer = setTimeout(() => this.fetchWeather(), 1000);

      localStorage.setItem("location", curLocation);
    }
  }

  render() {
    const { location, displayLocation, weather, isLoading } = this.state;
    const isWeatherData = Object.keys(weather).length > 0;

    return (
      <div className="app">
        <h1>Legacy Weather</h1>
        <Input value={location} onLocationChange={this.handleLocationChange} />

        {isLoading && <Loader />}
        {isWeatherData && (
          <Weather location={displayLocation} weather={weather} />
        )}
      </div>
    );
  }
}

export default App;
