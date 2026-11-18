/** Cuánto hay que bajar (px) para que aparezca el botón. */
const SHOW_AFTER_PX = 600;

function initBackToTop(button: HTMLButtonElement): void {
  const update = (): void => {
    const visible = window.scrollY > SHOW_AFTER_PX;
    button.dataset.visible = String(visible);
    // `inert` evita foco y lectura por lectores de pantalla mientras está oculto.
    button.toggleAttribute('inert', !visible);
  };

  button.addEventListener('click', () => {
    // El CSS global ya desactiva el scroll suave si el usuario pidió reducir movimiento.
    window.scrollTo({ top: 0 });
    // Devuelve el foco al inicio de la página para quien navega con teclado.
    document.getElementById('inicio')?.focus({ preventScroll: true });
  });

  window.addEventListener('scroll', update, { passive: true });
  update();
}

const button = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
if (button) initBackToTop(button);
