let toneStarted = false;
const clickSynth = new Tone.MetalSynth({
    frequency: 150, envelope: { attack: 0.001, decay: 0.15, release: 0.05 },
    harmonicity: 3.1, modulationIndex: 16, resonance: 2000, octaves: 1.5
}).toDestination();
clickSynth.volume.value = -28;

const button = document.getElementById('metallicButton');
const parallaxFactor = 0.1;
const maxParallax = 2.5;

button.addEventListener('mousemove', (e) => {
    if (!button.matches(':hover')) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let parallaxX = Math.max(-maxParallax, Math.min(maxParallax, -x * parallaxFactor));
    let parallaxY = Math.max(-maxParallax, Math.min(maxParallax, -y * parallaxFactor));
    button.style.setProperty('--parallax-x', `${parallaxX}px`);
    button.style.setProperty('--parallax-y', `${parallaxY}px`);
    button.style.setProperty('--parallax-transition', 'transform 0.05s linear');
});

button.addEventListener('mouseleave', () => {
     button.style.setProperty('--parallax-transition', 'transform 0.35s ease-out');
     button.style.setProperty('--parallax-x', '0px');
     button.style.setProperty('--parallax-y', '0px');
});

button.addEventListener('mousedown', async () => {
    if (!toneStarted) {
        try {
            await Tone.start();
            toneStarted = true; console.log('Audio context started');
        } catch (e) { console.error("Error starting Tone.js:", e); return; }
    }
    clickSynth.triggerAttackRelease("C4", "16n", Tone.now());
});

button.addEventListener('click', (e) => { /* button.blur(); */ });