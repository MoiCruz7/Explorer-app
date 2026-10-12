import './style.css'
import { ApiError, fetchCountries } from './api/countries'
import { renderCountries } from './render/countryList'
import { renderError, renderLoading } from './render/states'
import type { Country } from './types/country'
import { debounce } from './utils/debounce'
import { filterCountries, getRegions } from './utils/filter'
import { getRegionLabel } from './utils/format'

const SEARCH_DEBOUNCE_MS = 300

function fillRegions(select: HTMLSelectElement, countries: Country[]): void {
  while (select.options.length > 1) select.remove(1)

  for (const region of getRegions(countries)) {
    select.add(new Option(getRegionLabel(region), region))
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'No se pudo conectar con el servidor. Revisa tu conexión a internet.'
}

function initCountryExplorer(
  list: HTMLElement,
  searchInput: HTMLInputElement,
  regionSelect: HTMLSelectElement,
): void {
  let countries: Country[] = []
  let isReady = false
  let search = searchInput.value
  let region = regionSelect.value

  const update = (): void => {
    if (!isReady) return
    renderCountries(list, filterCountries(countries, search, region))
  }

  const debouncedSearch = debounce((value: string): void => {
    search = value
    update()
  }, SEARCH_DEBOUNCE_MS)

  searchInput.addEventListener('input', () => debouncedSearch(searchInput.value))

  regionSelect.addEventListener('change', () => {
    region = regionSelect.value
    search = searchInput.value
    update()
  })

  const load = async (): Promise<void> => {
    isReady = false
    regionSelect.disabled = true
    renderLoading(list)

    try {
      countries = await fetchCountries()
      fillRegions(regionSelect, countries)
      regionSelect.disabled = false
      isReady = true
      update()
    } catch (error: unknown) {
      renderError(list, getErrorMessage(error), () => void load())
    }
  }

  void load()
}

const list = document.querySelector<HTMLElement>('#country-list')
const searchInput = document.querySelector<HTMLInputElement>('#search-input')
const regionSelect = document.querySelector<HTMLSelectElement>('#region-select')

if (list && searchInput && regionSelect) {
  initCountryExplorer(list, searchInput, regionSelect)
}