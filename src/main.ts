import './style.css'
import { fetchCountries } from './api/countries'

fetchCountries()
  .then((countries) => console.log(countries.length, countries[0]))
  .catch((error: unknown) => console.error(error))