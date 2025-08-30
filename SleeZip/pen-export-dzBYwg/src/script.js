path = document.querySelector('path');
pathTo = path.dataset.path;
console.log(pathTo);

anime({
  targets: path,
  d: pathTo,
  direction: 'alternate',
  loop: true
})