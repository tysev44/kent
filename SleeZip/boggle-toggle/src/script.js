gsap.config({trialWarn: false});
let select = s => document.querySelector(s),
		toArray = s => gsap.utils.toArray(s),
		mainSVG = select('#mainSVG'),
		isOn = false

gsap.set('svg', {
	visibility: 'visible'
})

function clickOn (e) {

	

	let tl = gsap.timeline({
		onStart: function() {
			select('#whole').style.pointerEvents = 'none';
		},
		onComplete: function() {
			select('#whole').style.pointerEvents = 'auto';
		}
	});
	
	tl.to('#whole', {
		rotation: '+=90',
		svgOrigin: '420 300',
		ease: 'elastic(0.95, 0.5)'
	})
.to('body', {
		//backgroundColor: '#C9D9C1'
	}, 0)
	.to('#dragger', {
		x:'+=70',		
		ease: 'expo.in'
	})
	.to('#dragger', {		
		fill: '#41BA20',
		duration: 0.2,
	}, 0)
	.to('#panel', {
		x:'+=70',
		ease: 'expo.in'
	}, '-=0.35')
	.add('end', '+=0.04')
	.to('#whole', {
		rotation: '+=90',
		svgOrigin: '420 300',
		ease: 'elastic(0.95, 0.5)'
	}, 'end')

	
}

function clickOff (e) {

let tl = gsap.timeline({
	onStart: function() {
		select('#whole').style.pointerEvents = 'none';
	},
	onComplete: function() {
		select('#whole').style.pointerEvents = 'auto';
	}
});
	
	tl.to('#whole', {
		rotation: '-=90',
		svgOrigin: '350 300',
		ease: 'elastic(0.95, 0.5)'
	})
.to('body', {
		//backgroundColor: '#F5F7F1'
	}, 0)	
	 .to('#dragger', {
		x:'+=70',
		ease: 'expo.in'
	})
	 .to('#dragger', {
		fill: '#B3B8C4',
		duration: 0.2,
	}, 0)
	.to('#panel', {
		x:'+=70',
		ease: 'expo.in'
	}, '-=0.35')
	.add('end', '+=0.04')
	.to('#whole', {
		rotation: '-=90',
		svgOrigin: '350 300',
		ease: 'elastic(0.95, 0.5)'
	}, 'end')

	
}

select('#whole').addEventListener('click', (function(e) {
	
	isOn = !isOn;
	
	if(isOn) {
		clickOn(e);
		
	} else {
		clickOff(e)
		select('#whole').style.pointerEvents = 'auto';
	}
	
}))
//gsap.globalTimeline.timeScale(0.5)
//ScrubGSAPTimeline(tl)