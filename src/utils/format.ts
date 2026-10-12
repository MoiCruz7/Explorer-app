import type { Country } from '../types/country';

export const NOT_AVAILABLE = 'No disponible';

const REGION_LABELS: Record<string, string> = {
  Africa: 'África',
  Americas: 'América',
  Asia: 'Asia',
  Europe: 'Europa',
  Oceania: 'Oceanía',
};

function cleanText(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

export function getCountryName(country: Country): string {
  return (
    cleanText(country.names.common) ??
    cleanText(country.names.official) ??
    NOT_AVAILABLE
  );
}

export function getCapital(country: Country): string {
  const names = (country.capitals ?? [])
    .map((capital) => cleanText(capital.name))
    .filter((name): name is string => name !== null);

  return names.length > 0 ? names.join(', ') : NOT_AVAILABLE;
}

export function getRegionLabel(region: string | null | undefined): string {
  const text = cleanText(region);
  if (text === null) return NOT_AVAILABLE;
  return REGION_LABELS[text] ?? text;
}

export function formatPopulation(population: number | null | undefined): string {
  if (typeof population !== 'number' || !Number.isFinite(population)) {
    return NOT_AVAILABLE;
  }
  return new Intl.NumberFormat('es-SV').format(population);
}

export function getFlagUrl(country: Country): string | null {
  return cleanText(country.flag.url_svg) ?? cleanText(country.flag.url_png);
}

export function getFlagAlt(country: Country): string {
  return `Bandera de ${getCountryName(country)}`;
}

export function getOfficialName(country: Country): string {
  return cleanText(country.names.official) ?? getCountryName(country);
}

export function getLanguages(country: Country): string {
  const names = (country.languages ?? [])
    .map((language) => cleanText(language.name))
    .filter((name): name is string => name !== null);

  return names.length > 0 ? names.join(', ') : NOT_AVAILABLE;
}

export function getCurrencies(country: Country): string {
  const items = (country.currencies ?? [])
    .map((currency) => {
      const name = cleanText(currency.name);
      const code = cleanText(currency.code);
      if (name !== null && code !== null) return `${name} (${code})`;
      return name ?? code;
    })
    .filter((item): item is string => item !== null);

  return items.length > 0 ? items.join(', ') : NOT_AVAILABLE;
}