import './style.css'
import { fetchCountries } from './api/countries'
import { filterCountries, getRegions } from './utils/filter'
import { formatPopulation, getCapital, getRegionLabel } from './utils/format'

fetchCountries()
  .then((countries) => {
    console.log(getRegions(countries))
    console.log(filterCountries(countries, 'al', 'Europe').map((c) => c.names.common))

    const first = countries[0]
    console.log(getCapital(first), formatPopulation(first.population), getRegionLabel(first.region))
  })
  .catch((error: unknown) => console.error(error))