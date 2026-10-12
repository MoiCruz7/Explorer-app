import type { Country } from '../types/country';

export const ALL_REGIONS = 'all';

export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function getRegions(countries: Country[]): string[] {
  const regions = new Set<string>();

  for (const country of countries) {
    const region = country.region?.trim();
    if (region) regions.add(region);
  }

  return [...regions].sort();
}

export function filterCountries(
  countries: Country[],
  search: string,
  region: string,
): Country[] {
  const query = normalizeText(search);

  return countries.filter((country) => {
    const matchesRegion =
      region === ALL_REGIONS || country.region?.trim() === region;
    const matchesSearch =
      query === '' || normalizeText(country.names.common).includes(query);

    return matchesRegion && matchesSearch;
  });
}