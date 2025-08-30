const $card = document.querySelector('.card');
const $gradient = $card.querySelector('.gradient');
const $check = $card.querySelector('.check');

$card.addEventListener('pointerdown', async (e) => {
    if(e.target.matches('input')) return;
    $check.classList.remove('animate');
    $check.style.transitionDuration = '1s';
    repaint(() => {
        $check.style.scale = '1.4';
    });
    stopPulse();
});

$card.addEventListener('pointerup', async (e) => {
    if(e.target.matches('input')) return;
    $check.classList.add('animate');
    $check.style.transitionDuration = '0.25s';
    $check.style.scale = '';
    restartPulse();
});

$check.addEventListener('keypress', async (e) => {
    stopPulse();
    repaint(() => {
        replayBounce();
        restartPulse();
    }, 100);
});



async function repaint(cb, delay = 0) {
    requestAnimationFrame(() => {
        setTimeout(cb, delay);
    });
}

async function stopPulse() {
    $gradient.style.opacity = 0;
    repaint(() => {
        $gradient.classList.remove('animate');
    },150);
}

function restartPulse() {
    $gradient.style.opacity = 0;
    repaint(() => {
        $gradient.style.opacity = 1;
        $gradient.classList.add('animate');
    }, 150);
}

async function replayBounce() {
    $check.classList.remove('animate');
    repaint(() => {
        $check.classList.add('animate');
    })
}

repaint(() => {
    replayBounce();
    restartPulse();
}, 1000);




const $hue1 = document.querySelector('#h1');
const $hue2 = document.querySelector('#h2');

$hue1.addEventListener( 'input', (event) => {
    requestAnimationFrame(() => {
        document.body.style.setProperty('--hue1', event.target.value );
    })
});

$hue2.addEventListener( 'input', (event) => {
    requestAnimationFrame(() => {
        document.body.style.setProperty('--hue2', event.target.value );
    })
});

$hue1.addEventListener('change', () => {
    stopPulse();
    repaint(() => {
        replayBounce();
        restartPulse();
    }, 500);
})