import type { Country } from '../types/country';
import { normalizeText } from './filter';

const DETAIL_PAGE = '/src/pages/detalle.html';

export function getDetailUrl(country: Country): string {
  const code = country.codes.alpha_3.trim();
  const params = new URLSearchParams();

  if (code) {
    params.set('code', code);
  } else {
    params.set('name', country.names.common);
  }

  return `${DETAIL_PAGE}?${params.toString()}`;
}

export function findCountry(countries: Country[], params: URLSearchParams): Country | null {
  const code = params.get('code')?.trim();
  if (code) {
    const wantedCode = code.toUpperCase();
    return countries.find((country) => country.codes.alpha_3.toUpperCase() === wantedCode) ?? null;
  }

  const name = params.get('name')?.trim();
  if (name) {
    const wantedName = normalizeText(name);
    return (
      countries.find((country) => normalizeText(country.names.common) === wantedName) ?? null
    );
  }

  return null;
}