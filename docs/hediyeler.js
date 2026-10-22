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
