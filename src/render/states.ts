import { createElement } from './dom';

function createSkeletonCard(): HTMLElement {
  const card = createElement(
    'div',
    'animate-pulse motion-reduce:animate-none overflow-hidden rounded-lg border border-bronce/20 bg-musgo',
  );
  card.setAttribute('aria-hidden', 'true');

  const body = createElement('div', 'space-y-2 px-4 py-3');
  body.append(
    createElement('div', 'h-5 w-2/3 rounded bg-papel/20'),
    createElement('div', 'h-4 w-full rounded bg-papel/10'),
    createElement('div', 'h-4 w-1/2 rounded bg-papel/10'),
  );

  card.append(createElement('div', 'h-32 w-full bg-papel/10'), body);
  return card;
}

function createMessageBox(title: string, description: string, borderClass: string): HTMLElement {
  const box = createElement(
    'div',
    `col-span-full rounded-lg border bg-musgo px-6 py-10 text-center ${borderClass}`,
  );

  box.append(
    createElement('h3', 'font-heading text-xl font-semibold text-papel', title),
    createElement('p', 'mt-2 font-body text-papel/80', description),
  );

  return box;
}

export function renderLoading(container: HTMLElement, count = 6): void {
  const status = createElement('p', 'sr-only', 'Cargando países');
  status.setAttribute('role', 'status');

  container.setAttribute('aria-busy', 'true');
  container.replaceChildren(status, ...Array.from({ length: count }, createSkeletonCard));
}

export function renderEmpty(container: HTMLElement): void {
  const box = createMessageBox(
    'Sin resultados',
    'Ningún país coincide con tu búsqueda y la región seleccionada. Prueba con otro nombre o cambia el filtro.',
    'border-bronce/20',
  );
  box.setAttribute('role', 'status');

  container.removeAttribute('aria-busy');
  container.replaceChildren(box);
}

export function renderError(
  container: HTMLElement,
  message: string,
  onRetry: () => void,
): void {
  const box = createMessageBox('No se pudieron cargar los países', message, 'border-error');
  box.setAttribute('role', 'alert');

  const retry = createElement(
    'button',
    'mt-4 rounded-full border border-bronce/30 bg-granate px-5 py-2 font-ui text-sm font-semibold text-papel transition-all duration-300 ease-out hover:border-bronce focus-visible:outline-none focus-visible:border-bronce active:scale-95',
    'Reintentar',
  );
  retry.type = 'button';
  retry.addEventListener('click', onRetry);
  box.append(retry);

  container.removeAttribute('aria-busy');
  container.replaceChildren(box);
}