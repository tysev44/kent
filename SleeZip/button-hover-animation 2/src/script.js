const button = document.querySelector('.button-hover');

let lastAdded = 0;

function setCircleColor(circle, x) {
  const xPos = x / button.offsetWidth;
  const color = `linear-gradient(to right, #80b9c8 ${xPos * 100}%, #284692 ${xPos * 100}%)`;
  circle.style.background = color;
}

button.addEventListener('pointerenter', () => {
  button.addEventListener('pointermove', onMove);
});

function onMove(event) {
  const currentTime = Date.now();
  if (currentTime - lastAdded > 100) {
    lastAdded = currentTime;
    const circle = createCircle(event.offsetX, event.offsetY);
    button.appendChild(circle);
    setCircleColor(circle, event.offsetX);
    fadeCircle(circle);
  }
}

button.addEventListener('pointerleave', () => {
  button.removeEventListener('pointermove', onMove);
});

function createCircle(x, y) {
  const circle = document.createElement('div');
  circle.classList.add('circle');
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  return circle;
}

function fadeCircle(circle) {
  setTimeout(() => circle.classList.add('fade-in'), 0);

  setTimeout(() => {
    circle.classList.replace('fade-in', 'fade-out');
    setTimeout(() => button.removeChild(circle), 1000);
  }, 1000);
}
