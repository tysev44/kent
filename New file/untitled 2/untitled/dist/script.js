import gsap from 'https://esm.sh/gsap';
import MotionPathPlugin from 'https://esm.sh/gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);
const btn = document.querySelector('button');
const containerEl = document.querySelector('.button-container > div');
let tween = null;
const keyPoints = [
    { t: 0.0, y: 0, width: 240, z: -40, spreadFactor: 0.75 },
    { t: 0.25, y: 40, width: 280, z: 0, spreadFactor: 0.9 },
    { t: 0.5, y: 0, width: 360, z: 50, spreadFactor: 1.25 },
    { t: 0.75, y: -32, width: 280, z: 0, spreadFactor: 0.9 },
    { t: 1.0, y: 0, width: 240, z: -40, spreadFactor: 0.75 },
];
function interpolateKeyPoints(t) {
    let p1 = keyPoints[0];
    let p2 = keyPoints[keyPoints.length - 1];
    for (let i = 0; i < keyPoints.length - 1; i++) {
        if (t >= keyPoints[i].t && t <= keyPoints[i + 1].t) {
            p1 = keyPoints[i];
            p2 = keyPoints[i + 1];
            break;
        }
    }
    const range = p2.t - p1.t;
    const lt = (t - p1.t) / range;
    const y = p1.y + (p2.y - p1.y) * lt;
    const width = p1.width + (p2.width - p1.width) * lt;
    const z = p1.z + (p2.z - p1.z) * lt;
    const spreadFactor = p1.spreadFactor + (p2.spreadFactor - p1.spreadFactor) * lt;
    return { y, width, z, spreadFactor };
}
const opts = {
    count: 80,
    segments: 100,
    timeMin: 1.75,
    timeMax: 2.25,
    ySpread: 10,
};
const particles = [];
for (let i = 0; i < opts.count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const s = Math.random() * 1.5 + 0.5;
    p.style.width = s + 'px';
    p.style.height = s + 'px';
    containerEl.appendChild(p);
    particles.push(p);
}
function generatePath() {
    const path = [];
    const xRand = Math.random() * 0.3 - 0.15;
    const yRand = Math.random() * 0.3 - 0.15;
    const xJitter = Math.random() * 0.2;
    for (let i = 0; i <= opts.segments; i++) {
        const t = i / opts.segments;
        const { y, width, z, spreadFactor } = interpolateKeyPoints(t);
        const halfW = 0;
        const wave = Math.sin(t * Math.PI) * 0.5 + 0.5;
        const spreadX = (wave * (halfW * 2) - halfW) * (1 + xJitter);
        const perspective = 1 + z * 0.001;
        const finalX = spreadX * perspective + xRand * width * spreadFactor;
        const finalY = y + yRand * opts.ySpread;
        path.push({ x: finalX, y: finalY });
    }
    return path;
}
function resetParticles() {
    particles.forEach((p) => {
        gsap.set(p, { x: 0, y: 0, opacity: 0 });
    });
}
resetParticles();
let anim = null;
function createAnimation() {
    const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
            anim = null;
            tween = null;
        },
    });
    particles.forEach((p) => {
        const dur = Math.random() * (opts.timeMax - opts.timeMin) + opts.timeMin;
        const path = generatePath();
        tl.set(p, { x: path[0].x, y: path[0].y }, 0);
        tl.fromTo(p, { opacity: 0 }, {
            keyframes: [
                { opacity: 1, duration: dur * 0.1, delay: dur * 0.075 },
                { opacity: 0, duration: dur * 0.05, delay: dur * 0.75 },
            ],
            ease: 'power1.inOut',
        }, 0);
        tl.to(p, {
            duration: dur,
            ease: 'sine.inOut',
            motionPath: {
                path: path,
                autoRotate: false,
                curviness: 0,
            },
        }, 0);
    });
    return tl;
}
btn.addEventListener('mouseenter', () => {
    if (tween !== null && tween.isActive() && tween.progress() <= .5) {
        return;
    }
    if (anim) {
        anim.kill();
    }
    resetParticles();
    anim = createAnimation();
    anim.play();
});
btn.addEventListener('mouseleave', () => {
    if (tween !== null && tween.isActive()) {
        return;
    }
    if (anim) {
        anim.kill();
        anim = null;
    }
    particles.forEach((p) => {
        const currentX = gsap.getProperty(p, 'x');
        const currentY = gsap.getProperty(p, 'y');
        const fallDistance = Math.random() * 50;
        const horizontalDrift = Math.random() * 40 - 20;
        const rotateVal = Math.random() * 30 - 15;
        gsap.killTweensOf(p);
        gsap.set(p, { x: currentX, y: currentY });
        tween = gsap.to(p, {
            duration: 1 + Math.random() * 0.5,
            y: `+=${fallDistance}`,
            x: `+=${horizontalDrift}`,
            rotation: rotateVal,
            opacity: 0,
            ease: 'power1.out',
            onComplete: () => {
                tween = null;
            },
        });
    });
});