import { formatCount, isGenderFilter, matchesFilters, type GenderFilter } from '../lib/filter';

/**
 * Mejora progresiva: el HTML ya contiene todo el catálogo; este script solo
 * muestra/oculta filas según la búsqueda y el filtro de género.
 */
function initCatalogFilter(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-search-form]');
  const input = root.querySelector<HTMLInputElement>('[data-search-input]');
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-gender]'));
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-item]'));
  const list = root.querySelector<HTMLElement>('[data-list]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const emptyQuery = root.querySelector<HTMLElement>('[data-empty-query]');

  if (!input || !count || !list || !empty || !emptyQuery) return;

  const items = rows.map((el) => ({
    el,
    code: el.dataset.code ?? '',
    name: el.dataset.name ?? '',
    gender: el.dataset.itemGender ?? '',
  }));

  let gender: GenderFilter = 'Todos';

  const render = (): void => {
    const query = input.value;
    let visible = 0;

    for (const item of items) {
      const show = matchesFilters(item, query, gender);
      item.el.hidden = !show;
      if (show) visible += 1;
    }

    count.textContent = formatCount(visible);
    list.hidden = visible === 0;
    empty.hidden = visible !== 0;
    // textContent (no innerHTML): la búsqueda es entrada del usuario.
    emptyQuery.textContent = query.trim();
  };

  input.addEventListener('input', render);
  form?.addEventListener('submit', (event) => event.preventDefault());

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const value = chip.dataset.gender;
      if (!isGenderFilter(value)) return;
      gender = value;
      for (const other of chips) {
        other.setAttribute('aria-pressed', String(other === chip));
      }
      render();
    });
  }

  render();
}

const root = document.querySelector<HTMLElement>('[data-catalog]');
if (root) initCatalogFilter(root);
