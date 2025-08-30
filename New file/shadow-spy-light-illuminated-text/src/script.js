// ====== Updated JS ======
const canvas = document.getElementById('scene');
if (!canvas) throw new Error('No <canvas id="scene"> found.');
const ctx = canvas.getContext('2d');
const character = document.getElementById('character');

const characterY = 300;
const lampRadius = 120;
const textY = 340;
const speed = 3;

// make sure we get a sensible initial X
let initialLeft = parseInt(getComputedStyle(character).left, 10);
if (isNaN(initialLeft)) initialLeft = character ? (character.offsetLeft || 50) : 50;
let characterX = initialLeft;

let facing = 1; // 1 = right, -1 = left

// key state (robust for hold/repeat)
const keys = { left: false, right: false };
let lastKey = null;

// sprite walk animation (keeps your backgroundPositionX approach)
let frame = 0;
let walkInterval = null;
let walking = false;

function startWalking() {
  if (walking) return;
  walking = true;
  if (walkInterval) clearInterval(walkInterval);
  walkInterval = setInterval(() => {
    frame = (frame + 1) % 4;
    character.style.backgroundPositionX = `-${frame * 170}px`;
  }, 150);
}

function stopWalking() {
  walking = false;
  if (walkInterval) {
    clearInterval(walkInterval);
    walkInterval = null;
  }
  frame = 0;
  character.style.backgroundPositionX = '0px';
}

// Resize handling
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = 400;
  // clamp characterX if canvas shrinks
  characterX = Math.max(0, Math.min(canvas.width - (character.offsetWidth || 60), characterX));
  character.style.left = `${characterX}px`;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Input handlers (no gradient creation here)
window.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

  if (e.key === 'ArrowLeft') {
    keys.left = true;
    lastKey = 'left';
    facing = -1;
    character.style.transform = 'scaleX(-1)';
  } else if (e.key === 'ArrowRight') {
    keys.right = true;
    lastKey = 'right';
    facing = 1;
    character.style.transform = 'scaleX(1)';
  }

  startWalking();
  e.preventDefault();
});

window.addEventListener('keyup', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;

  // decide facing when both keys are involved
  if (keys.left && !keys.right) {
    facing = -1;
    character.style.transform = 'scaleX(-1)';
  } else if (keys.right && !keys.left) {
    facing = 1;
    character.style.transform = 'scaleX(1)';
  } else if (keys.left && keys.right) {
    // if both held, keep the last pressed direction
    if (lastKey === 'left') {
      facing = -1;
      character.style.transform = 'scaleX(-1)';
    } else {
      facing = 1;
      character.style.transform = 'scaleX(1)';
    }
  }

  if (!keys.left && !keys.right) stopWalking();
  e.preventDefault();
});

// Update movement based on keys (called every frame)
function update() {
  let move = 0;
  if (keys.left && !keys.right) move = -speed;
  else if (keys.right && !keys.left) move = speed;
  else if (keys.left && keys.right) move = (lastKey === 'left' ? -speed : speed);

  if (move !== 0) {
    characterX += move;
    characterX = Math.max(0, Math.min(canvas.width - (character.offsetWidth || 60), characterX));
    character.style.left = `${characterX}px`;
  }
}

// Draw everything — gradient calculated here every frame (uses facing)
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGrad.addColorStop(0, '#0B1215');
  bgGrad.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Platform
  ctx.fillStyle = '#0B1215';
  ctx.fillRect(0, 343, canvas.width, 100);

  // Base text (dim)
  ctx.font = 'bold 200px Anton, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#0B1215';
  ctx.fillText('SHADOW', canvas.width / 2, textY);

  // Lamp gradient overlay — computed from character centre + facing
  const charWidth = character.offsetWidth || 40;
  const charCenterX = characterX + charWidth / 2;
  const lampX = charCenterX + (60 * facing); // offset in front of the character
  const lampY = characterY - 15;

  const textGrad = ctx.createRadialGradient(lampX, lampY, 10, lampX, lampY, lampRadius);
  textGrad.addColorStop(0, '#eeeeee');
  textGrad.addColorStop(1, '#0B1215');

  ctx.fillStyle = textGrad;
  ctx.fillText('SHADOW', canvas.width / 2, textY);
}

function gameLoop() {
  update();
  drawScene();
  requestAnimationFrame(gameLoop);
}

// ensure DOM position matches variables initially
character.style.left = `${characterX}px`;
gameLoop();
