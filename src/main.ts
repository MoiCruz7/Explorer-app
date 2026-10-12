import './style.css'
import { fetchCountries } from './api/countries'
import { renderCountries } from './render/countryList'
import { renderError, renderLoading } from './render/states'

const container = document.createElement('div')
container.className = 'grid grid-cols-1 gap-4 p-6 tablet:grid-cols-2 desktop:grid-cols-3'
document.body.append(container)

renderLoading(container)

fetchCountries()
  .then((countries) => renderCountries(container, countries))
  .catch((error: unknown) =>
    renderError(
      container,
      error instanceof Error ? error.message : 'Error desconocido',
      () => location.reload(),
    ),
  )