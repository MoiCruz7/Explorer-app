import type { Country } from '../types/country';
import { createCountryCard } from './countryCard';
import { renderEmpty } from './states';

export function renderCountries(container: HTMLElement, countries: Country[]): void {
  if (countries.length === 0) {
    renderEmpty(container);
    return;
  }

  container.removeAttribute('aria-busy');
  container.replaceChildren(...countries.map((country) => createCountryCard(country)));
}