import type { Country } from '../types/country';
import {
  formatPopulation,
  getCapital,
  getCountryName,
  getRegionLabel,
} from '../utils/format';
import { getDetailUrl } from '../utils/lookup';
import { createElement } from './dom';
import { createFlag } from './flag';

const CARD_CLASSES =
  'group block overflow-hidden bg-musgo rounded-lg border border-bronce/20 cursor-pointer transition-all duration-300 ease-out hover:border-bronce hover:-translate-y-0.5 focus-visible:outline-none focus-visible:border-bronce active:translate-y-0';

const FLAG_CLASSES =
  'h-32 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105';
const FLAG_PLACEHOLDER_CLASSES = 'h-32 w-full';

function appendInfo(list: HTMLElement, label: string, value: string): void {
  list.append(
    createElement('dt', 'text-papel/70', label),
    createElement('dd', 'text-papel/90', value),
  );
}

function createCardBody(country: Country): HTMLElement {
  const body = createElement('div', 'px-4 py-3');
  const list = createElement(
    'dl',
    'mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-ui text-sm',
  );

  appendInfo(list, 'Capital', getCapital(country));
  appendInfo(list, 'Región', getRegionLabel(country.region));
  appendInfo(list, 'Población', formatPopulation(country.population));

  body.append(
    createElement('h3', 'font-body text-lg text-papel', getCountryName(country)),
    list,
  );

  return body;
}

export function createCountryCard(country: Country): HTMLAnchorElement {
  const card = createElement('a', CARD_CLASSES);
  card.href = getDetailUrl(country);
  card.append(
    createFlag(country, FLAG_CLASSES, FLAG_PLACEHOLDER_CLASSES),
    createCardBody(country),
  );
  return card;
}