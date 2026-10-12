import type { Country } from '../types/country';

const BASE_URL = 'https://api.restcountries.com/countries/v5';
const PAGE_SIZE = 100;
const CACHE_KEY = 'explorer-countries-v5';

const FIELDS = [
  'codes.alpha_3',
  'names.common',
  'names.official',
  'flag.url_svg',
  'flag.url_png',
  'flag.description',
  'region',
  'population',
  'capitals',
].join(',');

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface CountriesPage {
  countries: Country[];
  total: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === 'string';
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || value === null || typeof value === 'number';
}

function isOptionalCapitals(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) &&
      value.every((item) => isRecord(item) && typeof item.name === 'string'))
  );
}

function isCountry(value: unknown): value is Country {
  if (!isRecord(value)) return false;

  const { codes, names, flag, region, population, capitals } = value;

  return (
    isRecord(codes) &&
    typeof codes.alpha_3 === 'string' &&
    isRecord(names) &&
    typeof names.common === 'string' &&
    typeof names.official === 'string' &&
    isRecord(flag) &&
    isOptionalString(flag.url_svg) &&
    isOptionalString(flag.url_png) &&
    isOptionalString(flag.description) &&
    isOptionalString(region) &&
    isOptionalNumber(population) &&
    isOptionalCapitals(capitals)
  );
}

function describeStatus(status: number): string {
  if (status === 401) return 'La clave de la API no es válida o fue revocada';
  if (status === 403) return 'La API rechazó la petición (cuota agotada o sin permiso)';
  if (status === 429) return 'Demasiadas peticiones seguidas, intenta de nuevo en unos segundos';
  return `No se pudieron obtener los países (HTTP ${status})`;
}

function parsePage(payload: unknown): CountriesPage {
  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new ApiError('La API devolvió un formato inesperado');
  }

  const { objects, meta } = payload.data;

  if (!Array.isArray(objects) || !isRecord(meta) || typeof meta.total !== 'number') {
    throw new ApiError('La API devolvió un formato inesperado');
  }

  const items: unknown[] = objects;
  return { countries: items.filter(isCountry), total: meta.total };
}

async function fetchPage(
  offset: number,
  apiKey: string,
  signal?: AbortSignal,
): Promise<CountriesPage> {
  const url = `${BASE_URL}?response_fields=${FIELDS}&limit=${PAGE_SIZE}&offset=${offset}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal,
  });

  if (!response.ok) {
    throw new ApiError(describeStatus(response.status), response.status);
  }

  const payload: unknown = await response.json();
  return parsePage(payload);
}

function readCache(): Country[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw === null) return null;

    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;

    const items: unknown[] = data;
    const countries = items.filter(isCountry);

    return countries.length > 0 && countries.length === items.length ? countries : null;
  } catch {
    return null;
  }
}

function writeCache(countries: Country[]): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(countries));
  } catch {
    // Sin almacenamiento disponible: se continúa sin caché.
  }
}

export async function fetchCountries(signal?: AbortSignal): Promise<Country[]> {
  const cached = readCache();
  if (cached !== null) return cached;

  const apiKey: unknown = import.meta.env.VITE_RESTCOUNTRIES_API_KEY;
  if (typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new ApiError('Falta la variable VITE_RESTCOUNTRIES_API_KEY en .env.local');
  }

  const countries: Country[] = [];
  let offset = 0;
  let total = 0;

  do {
    const page = await fetchPage(offset, apiKey, signal);
    countries.push(...page.countries);
    total = page.total;
    offset += PAGE_SIZE;
  } while (offset < total);

  if (countries.length === 0) {
    throw new ApiError('La API no devolvió países con la estructura esperada');
  }

  writeCache(countries);
  return countries;
}