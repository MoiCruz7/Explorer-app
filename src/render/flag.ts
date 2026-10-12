import type { Country } from '../types/country';
import { getFlagAlt, getFlagUrl } from '../utils/format';
import { createElement } from './dom';

export function createFlag(
  country: Country,
  imageClasses: string,
  placeholderClasses: string,
): HTMLElement {
  const createPlaceholder = (): HTMLElement =>
    createElement(
      'div',
      `flex items-center justify-center bg-negro-tinta/40 font-ui text-sm text-papel/70 ${placeholderClasses}`,
      'Sin bandera',
    );

  const url = getFlagUrl(country);
  if (url === null) return createPlaceholder();

  const image = createElement('img', imageClasses);
  image.src = url;
  image.alt = getFlagAlt(country);
  image.loading = 'lazy';
  image.addEventListener('error', () => image.replaceWith(createPlaceholder()), { once: true });

  return image;
}