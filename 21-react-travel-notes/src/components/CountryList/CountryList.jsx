import { useCities } from "../../contexts/CitiesContext";
import CountryItem from "../CountryItem/CountryItem";
import Spinner from "../Spinner/Spinner";
import Message from "../Message/Message";
import styles from "./CountryList.module.css";

function CountryList() {
  const { cities, isLoading } = useCities();

  const countries = [];
  cities.forEach(({ country, emoji }) => {
    if (!countries.find((countryObj) => countryObj.country === country))
      countries.push({ country, emoji });
  });

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
