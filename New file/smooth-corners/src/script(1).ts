document.addEventListener('DOMContentLoaded', () => {

	const squircleElement = document.querySelector('.squircle-button');
	const clipPathPath = document.querySelector('#squircle-clip path');

	const radiusXSlider = document.querySelector('#radius-x-slider');
	const radiusYSlider = document.querySelector('#radius-y-slider');
	const smoothnessSlider = document.querySelector('#smoothness-slider');

	const radiusXValueSpan = document.querySelector('#radius-x-value');
	const radiusYValueSpan = document.querySelector('#radius-y-value');
	const smoothnessValueSpan = document.querySelector('#smoothness-value');

	const codeBlocks = {
		css: {
			element: document.getElementById('css-code-block'),
			code:
			`<span class="token-selector">:root</span> {
  <span class="token-property" data-highlight-id="rx">--corner-radius-x</span>: <span class="token-number">28</span>;
  <span class="token-property" data-highlight-id="ry">--corner-radius-y</span>: <span class="token-number">28</span>;
  <span class="token-property" data-highlight-id="s">--corner-smoothness</span>: <span class="token-number">0.7</span>;
}

<span class="token-selector">.squircle-button</span> {
  <span class="token-comment">/* ... other styles ... */</span>
  <span class="token-property">clip-path</span>: <span class="token-function">url</span>(<span class="token-string">#squircle-clip</span>);
}`
		},
		js: {
			element: document.getElementById('js-code-block'),
			code:
			`<span class="token-keyword">function</span> <span class="token-function">updateSquirclePath</span>() {
  <span class="token-keyword" data-highlight-id="rx">let</span> <span class="token-variable">Rx</span> = <span class="token-function">parseFloat</span>(...)
  <span class="token-keyword" data-highlight-id="ry">let</span> <span class="token-variable">Ry</span> = <span class="token-function">parseFloat</span>(...)
  <span class="token-keyword" data-highlight-id="s">let</span> <span class="token-variable">S</span> = <span class="token-function">parseFloat</span>(...)

  <span class="token-comment">// Calculate control points</span>
  <span class="token-keyword">const</span> <span class="token-variable">Cx</span> = <span class="token-variable">Rx</span> * (<span class="token-number">1</span> - <span class="token-variable">S</span>);
  <span class="token-keyword">const</span> <span class="token-variable">Cy</span> = <span class="token-variable">Ry</span> * (<span class="token-number">1</span> - <span class="token-variable">S</span>);

  <span class="token-keyword">const</span> <span class="token-variable">pathData</span> = [
    <span class="token-string">\`M \${<span class="token-variable">Rx</span>},0\`</span>,
    <span class="token-string">\`C \${w - <span class="token-variable">Cx</span>},0 \${w},\${<span class="token-variable">Cy</span>} \${w},\${<span class="token-variable">Ry</span>}\`</span>,
    <span class="token-comment">// ... more path points</span>
  ].<span class="token-function">join</span>(<span class="token-string">' '</span>);

  <span class="token-variable">clipPathPath</span>.<span class="token-function">setAttribute</span>(<span class="token-string">'d'</span>, pathData);
}`
		}
	};

	function processCodeBlocks() {
		for (const key in codeBlocks) {
			const block = codeBlocks[key];
			const lines = block.code.split('\n');
			block.element.innerHTML = lines.map(line => `<span class="code-line">${line}</span>`).join('');
		}
	}

	let highlightTimeout;
	function highlightCode(id) {
		clearTimeout(highlightTimeout);
		// Remove previous highlights
		document.querySelectorAll('.code-line.highlight').forEach(el => el.classList.remove('highlight'));

		document.querySelectorAll(`[data-highlight-id="${id}"]`).forEach(el => {
			el.closest('.code-line').classList.add('highlight');
		});

		// Remove highlight after a delay
		highlightTimeout = setTimeout(() => {
			document.querySelectorAll('.code-line.highlight').forEach(el => el.classList.remove('highlight'));
		}, 1500);
	}

	function updateSquirclePath() {
		const width = squircleElement.offsetWidth;
		const height = squircleElement.offsetHeight;

		const style = getComputedStyle(document.documentElement);
		let Rx = parseFloat(style.getPropertyValue('--corner-radius-x'));
		let Ry = parseFloat(style.getPropertyValue('--corner-radius-y'));
		let S = parseFloat(style.getPropertyValue('--corner-smoothness'));

		Rx = Math.min(Rx, width / 2);
		Ry = Math.min(Ry, height / 2);
		if (Rx < 0) Rx = 0;
		if (Ry < 0) Ry = 0;

		// Calculate control point offsets for the Bézier curves.
		const Cx = Rx * (1 - S);
		const Cy = Ry * (1 - S);

		// Construct the SVG path string
		const pathData = [
			`M ${Rx},0`, `L ${width - Rx},0`, `C ${width - Cx},0 ${width},${Cy} ${width},${Ry}`,
			`L ${width},${height - Ry}`, `C ${width},${height - Cy} ${width - Cx},${height} ${width - Rx},${height}`,
			`L ${Rx},${height}`, `C ${Cx},${height} 0,${height - Cy} 0,${height - Ry}`,
			`L 0,${Ry}`, `C 0,${Cy} ${Cx},0 ${Rx},0`, 'Z'
		].join(' ');

		clipPathPath.setAttribute('d', pathData);
	}

	function setupEventListeners() {
		radiusXSlider.addEventListener('input', (e) => {
			document.documentElement.style.setProperty('--corner-radius-x', e.target.value);
			radiusXValueSpan.textContent = e.target.value;
			updateSquirclePath();
			highlightCode('rx');
		});

		radiusYSlider.addEventListener('input', (e) => {
			document.documentElement.style.setProperty('--corner-radius-y', e.target.value);
			radiusYValueSpan.textContent = e.target.value;
			updateSquirclePath();
			highlightCode('ry');
		});

		smoothnessSlider.addEventListener('input', (e) => {
			document.documentElement.style.setProperty('--corner-smoothness', e.target.value);
			smoothnessValueSpan.textContent = e.target.value;
			updateSquirclePath();
			highlightCode('s');
		});

		const resizeObserver = new ResizeObserver(() => updateSquirclePath());
		resizeObserver.observe(squircleElement);
	}

	function initialize() {
		processCodeBlocks();
		setupEventListeners();
		updateSquirclePath(); // Initial call
	}

	initialize();
});