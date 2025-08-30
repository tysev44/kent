gsap.config({trialWarn: false});
let select = s => document.querySelector(s),
		toArray = s => gsap.utils.toArray(s),
		mainSVG = select('#mainSVG'),
		dragger = select('#dragger'),
		dragger2 = select('#dragger2'),
		innerWidth = 64,
		outerWidth = 80,
		maxInnerWidth = 520,
		maxOuterWidth = 536,
		draggerWidth = outerWidth,
		dragProgress = 0,
		panelGradStart = 238,
		panelGradEnd = 670

gsap.set('svg', {
	visibility: 'visible'
})

let draggerPos = gsap.getProperty(dragger);
let draggerPos2 = gsap.getProperty(dragger2);
let panelTl = gsap.timeline({paused: true});
let gradientPosX = gsap.utils.mapRange(0, 1, panelGradStart, panelGradEnd);
panelTl.to('#panelStart', {
	morphSVG: {shape:'#panelEnd', shapeIndex: 0},
	ease: 'linear',
	duration: 3
})
let panel2Tl = gsap.timeline({paused: true});
let gradient2PosX = gsap.utils.mapRange(0, 1, panelGradStart, panelGradEnd);
panel2Tl.to('#panelStart2', {
	morphSVG: {shape:'#panelEnd', shapeIndex: 0},
	ease: 'linear',
	duration: 3
})
function onDrag () {
	
	dragProgress = draggerPos('x') / (maxOuterWidth - draggerWidth)
	dragProgress2 = draggerPos2('x') / (maxOuterWidth - draggerWidth)
	//console.log(dragProgress)
	gsap.set('#inner', {
		width: ((maxInnerWidth - innerWidth) * dragProgress) + innerWidth
	})
	gsap.set('#outer', {
		width: ((maxOuterWidth - outerWidth) * dragProgress) + outerWidth
	})
	gsap.set('#inner2', {
		width: ((maxInnerWidth - innerWidth) * dragProgress2) + innerWidth
	})
	gsap.set('#outer2', {
		width: ((maxOuterWidth - outerWidth) * dragProgress2) + outerWidth
	})
	panelTl.progress(dragProgress);
	panel2Tl.progress(dragProgress2);
	gsap.set('#panelGrad', {
		attr: {
			cx: gradientPosX(dragProgress),
			fx: gradientPosX(dragProgress)
		}
	})
	gsap.set('#panelGrad2', {
		attr: {
			cx: gradient2PosX(dragProgress2),
			fx: gradient2PosX(dragProgress2)
		}
	})
	
	select('#dragPercent').innerHTML = Math.round(dragProgress * 100) + '%';
	select('#dragPercent2').innerHTML = Math.round(dragProgress2 * 100) + '%';
}

let tl = gsap.timeline();
let draggable = Draggable.create(dragger, {
	bounds: {minX: 0, maxX: maxOuterWidth - draggerWidth, minY: 0, maxY: 0},
	onDrag: onDrag,
	inertia: true,
	onThrowUpdate: onDrag,
	overshootTolerance:0
})
let draggable2 = Draggable.create(dragger2, {
	bounds: {minX: 0, maxX: maxOuterWidth - draggerWidth, minY: 0, maxY: 0},
	onDrag: onDrag,
	inertia: true,
	onThrowUpdate: onDrag,
	overshootTolerance:0
})

onDrag()
//ScrubGSAPTimeline(tl)