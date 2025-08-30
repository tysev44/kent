document.addEventListener("DOMContentLoaded", () => {
    const rings = document.querySelectorAll(".ring");
    rings.forEach((ring) => {
        const dotCount = parseInt(ring.getAttribute("data-count"), 10);
        const dotSize = parseInt(ring.getAttribute("data-size"), 10);
        const radius = parseInt(ring.getAttribute("data-radius"), 10);
        const vertical = parseInt(ring.getAttribute("data-vertical"), 10);
        const time = ring.getAttribute("data-time");
        const opTarget = 0.2;
        const szTarget = 0.8;
        const vertTarget = 0.8;
        for (let i = 0; i < dotCount; i++) {
            const angle = (i / dotCount) * 2 * Math.PI;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const dot = document.createElement("div");
            dot.className = "dot";
            dot.style.transform = `translate(${x}px, ${y / 12}px)`;
            dot.style.width = `${dotSize}px`;
            dot.style.height = `${dotSize}px`;
            dot.style.animation = `vert ${time}s ease-in-out infinite`;
            dot.style.animationDelay = `${(i / dotCount) * (-1 * time) * 2}s`;
            dot.style.setProperty('--vert', `${vertical}px`);
            let p;
            if (i >= dotCount / 2) {
                const norm = (i - dotCount / 2) / (dotCount / 2);
                p = norm <= 0.5 ? 1 - 2 * norm : (2 * norm - 1);
            } else {
                p = 1;
            }
            dot.style.opacity = `${opTarget + p * (1 - opTarget)}`;
            dot.style.width = `${dotSize * (szTarget + p * (1 - szTarget))}px`;
            dot.style.height = `${dotSize * (szTarget + p * (1 - szTarget))}px`;
            dot.style.setProperty('--vert', `${vertical * (vertTarget + p * (1 - vertTarget))}px`);
            ring.appendChild(dot);
        }
    });
});
