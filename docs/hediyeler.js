const filters = document.querySelectorAll('[data-filter]');
const gifts = document.querySelectorAll('[data-category]');
const count = document.querySelector('.collection-count');
filters.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    let visible = 0;
    gifts.forEach(gift => {
      gift.hidden = category !== 'Hepsi' && gift.dataset.category !== category;
      if (!gift.hidden) visible++;
    });
    count.textContent = `${visible} hediye seni bekliyor`;
  });
});
const newGiftDialog = document.getElementById('new-gift-dialog');
if (newGiftDialog) {
  document.getElementById('new-gift-close').addEventListener('click', () => newGiftDialog.close());
  newGiftDialog.addEventListener('click', event => {
    const bounds = newGiftDialog.getBoundingClientRect();
    if (event.target === newGiftDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) newGiftDialog.close();
  });
  // Show once per tab visit; returning from the gift leaves the menu accessible.
  let seen = false;
  try { seen = sessionStorage.getItem('karar-carki-announced') === 'yes'; } catch {}
  if (!seen) {
    newGiftDialog.showModal();
    try { sessionStorage.setItem('karar-carki-announced', 'yes'); } catch {}
  }
}
