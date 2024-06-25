import { Component } from "react";

import Day from "./Day";

class Weather extends Component {
  state = { importantDay: this.props.weather.time.at(0) };

  render() {
    const { time, weathercode, temperature_2m_min, temperature_2m_max } =
      this.props.weather;

    const weatherList = time.map((date, idx) => (
      <Day
        key={date}
        code={weathercode[idx]}
        date={date}
        tempMin={temperature_2m_min[idx]}
        tempMax={temperature_2m_max[idx]}
        isToday={idx === 0}
        isImportant={this.state.importantDay === date}
        onClick={() => this.setState({ importantDay: date })}
      />
    ));

    return (
      <>
        <h2>Weather for {this.props.location}</h2>
        <ul className="weather">{weatherList}</ul>
      </>
    );
  }
}

export default Weather;
