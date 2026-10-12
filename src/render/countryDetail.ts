import type { Country } from '../types/country';
import {
  NOT_AVAILABLE,
  formatPopulation,
  getCapital,
  getCountryName,
  getCurrencies,
  getLanguages,
  getOfficialName,
  getRegionLabel,
} from '../utils/format';
import { createElement } from './dom';
import { createFlag } from './flag';

const FLAG_CLASSES =
  'mb-6 h-48 tablet:h-64 w-full rounded-lg border border-bronce/20 object-cover';
const FLAG_PLACEHOLDER_CLASSES =
  'mb-6 h-48 tablet:h-64 w-full rounded-lg border border-bronce/20';

const CTA_CLASSES =
  'mt-10 block w-full rounded-full border border-bronce/30 bg-granate py-3 text-center font-ui text-sm font-semibold uppercase tracking-wide text-papel transition-all duration-300 ease-out hover:border-bronce hover:bg-granate/90 focus-visible:outline-none focus-visible:border-bronce active:scale-[0.98]';

const LINK_BUTTON_CLASSES =
  'mt-4 inline-block rounded-full border border-bronce/30 bg-granate px-5 py-2 font-ui text-sm font-semibold text-papel transition-all duration-300 ease-out hover:border-bronce focus-visible:outline-none focus-visible:border-bronce active:scale-95';

function createSection(title: string, value: string): HTMLElement {
  const section = createElement('div');
  section.append(
    createElement('h2', 'mb-1 font-heading text-lg font-semibold text-bronce', title),
    createElement('p', 'font-body text-papel/80', value),
  );
  return section;
}

function getPopulationText(country: Country): string {
  const population = formatPopulation(country.population);
  return population === NOT_AVAILABLE ? population : `${population} habitantes`;
}

export function renderDetailLoading(container: HTMLElement): void {
  const status = createElement('p', 'sr-only', 'Cargando país');
  status.setAttribute('role', 'status');

  const skeleton = createElement('div', 'animate-pulse motion-reduce:animate-none space-y-4');
  skeleton.setAttribute('aria-hidden', 'true');
  skeleton.append(
    createElement('div', 'h-48 tablet:h-64 w-full rounded-lg bg-papel/10'),
    createElement('div', 'h-9 w-1/2 rounded bg-papel/20'),
    createElement('div', 'h-4 w-1/3 rounded bg-papel/10'),
    createElement('div', 'h-16 w-full rounded bg-papel/10'),
  );

  container.setAttribute('aria-busy', 'true');
  container.replaceChildren(status, skeleton);
}

export function renderCountryDetail(container: HTMLElement, country: Country): void {
  const name = getCountryName(country);

  const sections = createElement('div', 'flex flex-col gap-6');
  sections.append(
    createSection('Capital', getCapital(country)),
    createSection('Población', getPopulationText(country)),
    createSection('Idioma', getLanguages(country)),
    createSection('Moneda', getCurrencies(country)),
  );

  const cta = createElement('a', CTA_CLASSES, 'Explorar más');
  cta.href = '/src/pages/resultados.html';

  container.removeAttribute('aria-busy');
  container.replaceChildren(
    createFlag(country, FLAG_CLASSES, FLAG_PLACEHOLDER_CLASSES),
    createElement('h1', 'mb-1 font-heading text-4xl font-bold text-papel', name),
    createElement(
      'p',
      'mb-8 font-ui text-sm text-bronce',
      `${getRegionLabel(country.region)} · ${getOfficialName(country)}`,
    ),
    sections,
    cta,
  );

  document.title = `${name} - Explorer App`;
}

export function renderDetailNotFound(container: HTMLElement, message: string): void {
  const box = createElement(
    'div',
    'rounded-lg border border-bronce/20 bg-musgo px-6 py-10 text-center',
  );
  box.setAttribute('role', 'status');

  const link = createElement('a', LINK_BUTTON_CLASSES, 'Ver países');
  link.href = '/src/pages/resultados.html';

  box.append(
    createElement('h1', 'font-heading text-xl font-semibold text-papel', 'País no encontrado'),
    createElement('p', 'mt-2 font-body text-papel/80', message),
    link,
  );

  container.removeAttribute('aria-busy');
  container.replaceChildren(box);
}