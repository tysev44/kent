type Panel = { hue: number; index: number };

const NUM_PANELS = 20 as const;

const buildPanels = (): void => {
  const root = document.querySelector<HTMLDivElement>('#scroller')!;
  const data: readonly Panel[] = Array.from({ length: NUM_PANELS }, (_, i) => ({
    hue: Math.round((360 / NUM_PANELS) * -i / 10) + 200,
    index: i + 1,
  }));
  data.forEach(({ hue, index }) => {
    const el = document.createElement('section');
    el.className = 'panel';
    el.style.backgroundColor = `hsl(${hue} 65% 45%)`;
    el.style.borderColor = `hsl(${hue} 70% 55%)`;
    el.style.color = `hsl(${hue} 50% 95%)`;
    el.textContent = `${index}. Entry`;
    root.append(el);
  });
};

window.addEventListener('DOMContentLoaded', buildPanels);
