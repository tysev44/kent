const progress = document.querySelector('.progress');
const slider = document.querySelector('input[name="percent"]');

slider.addEventListener('input', event => {
	const percent = event.target.value;
	
	progress.style.setProperty('--progress-circle-offset', 100 -percent);
	
	console.log(percent);
	
	if(Number(percent) === 100) {
		gsap.to(progress, {
			keyframes: [{
				'--progress-circle-scale': .15,
				'--progress-circle-stroke': 32,
				duration: 1
			}, {
				'--progress-circle-x': '-6px',
				duration: 1
			}, {
				'--progress-tick-offset': 200,
				'--progress-circle-scale': 0,
				duration: 1
			}],
			ease: 'linear'
		});
	}
})

progress.style.setProperty('--progress-circle-offset', 100 -slider.value);

// $(document).ready(function() {

//     let progress = $('.progress'),
//         pie = progress.children('.pie'),
//         slider = $('input[name="percent"]');

//     slider.on('change input', e => {
//         setPercent(pie, slider.val());
//     }).trigger('change');

//     function setPercent(pie, value) {
//         let total = 2 * Math.PI * 8;
//         if(!progress.hasClass('complete')) {
//             // pie.css('strokeDasharray', (value * total / 100) + ' ' + total);
//             pie.style.setProperty('--progress-circle-offset', 50)
//             if(value == 100) {
//                 progress.addClass('complete');
//             }
//         }
//     }

// });