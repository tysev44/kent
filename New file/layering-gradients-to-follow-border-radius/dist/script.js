addEventListener('change', e => {
  document.body.style.setProperty('--dim', document.body.dataset.dim = +e.target.value);
}, false);