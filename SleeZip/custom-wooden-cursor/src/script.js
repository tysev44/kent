const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

document.body.style.cursor = 'none';

const positionElement = (e)=> {
  const mouseY = e.clientY;
  const mouseX = e.clientX;

  cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
}

window.addEventListener('pointermove', positionElement)

window.addEventListener('pointerleave', () => {
  cursor.style.display = 'none';
})

window.addEventListener('pointerout', () => {
  cursor.style.display = 'none';
})

window.addEventListener('pointermove', () => {
  cursor.style.display = 'block';
})