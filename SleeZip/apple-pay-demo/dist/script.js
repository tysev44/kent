[...document.querySelectorAll('.item')].forEach(node => {
  node.addEventListener('click', (e) => {
    [...document.querySelectorAll('.item')].forEach(other => {
      other.classList.toggle('hide');
    })
    e.target.classList.toggle('hide');
    e.target.classList.toggle('show');
  })
})