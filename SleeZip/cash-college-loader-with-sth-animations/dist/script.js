let eye = document.querySelector('svg');
let iris = eye.querySelector('#pupil')
let eyeBall = eye.querySelector('#moving');
let mask = eye.querySelectorAll('#clip-path, #outer-lid')
let eyeTrackerPoint = {x: 0, y: 0};
let eyeTrackOffset = 0.4;
let idleTimer = 1000;

let setViewport = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);  
}

setViewport();

window.addEventListener('resize', setViewport);

let animateEyeball = () => {
  let maskTimeline = anime.timeline({loop: true});
  maskTimeline.add({
    targets: mask,
    easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
    scaleY: [
      {value: 1, duration: 300},
      {value: 0.86, duration: 300},
      {value: 0.9, duration: 300},
      {value: 0.86, duration: 300},
      {value: 0.86, duration: 1000},
      {value: 0.8, duration: 300},
      {value: 0.9, duration: 300},
      {value: 0.4, duration: 200},
      {value: 0.9, duration: 200},
      {value: 0.9, duration: 200},
      {value: 0.84, duration: 200},
      {value: 0.02, duration: 200},
      {value: 0.9, duration: 200},
      {value: 0.9, duration: 100},
      {value: 0.01, duration: 200},
      {value: 1, duration: 200},
      {value: 1, duration: 800},
    ],
  });
  
  let eyeBallTimeline = anime.timeline({loop: true});
    eyeBallTimeline.add({
    targets: eyeBall,
    easing: 'cubicBezier(0.25, 0.1, 0.25, 1)',
    translateX: [
      {value: '0%', duration: 1000},
      {value: '22%', duration: 300},
      {value: '22%', duration: 1000},
      {value: '11%', duration: 300},
      {value: '11%', duration: 1400},
      {value: '22%', duration: 300},
      {value: '22%', duration: 1000},
      {value: '-28%', duration: 300},
      {value: '-4%', duration: 300},
      {value: '1%', duration: 300},
      {value: '1%', duration: 500},
      {value: '-23%', duration: 300},
      {value: '-30%', duration: 300},
      {value: '-26%', duration: 300},
      {value: '-26%', duration: 1000},
      {value: '20%', duration: 300},
      {value: '10%', duration: 300},
      {value: '10%', duration: 1000},
      {value: '8%', duration: 300},
      {value: '8%', duration: 1000},
      {value: '-5%', duration: 300},
      {value: '0%', duration: 300},
      {value: '0%', duration: 1000},
      {value: '-7%', duration: 300},
      {value: '1%', duration: 300},
      {value: '1%', duration: 1000},
      {value: '17%', duration: 300},
      {value: '17%', duration: 300},
      {value: '0%', duration: 300},
    ],
      translateY: [
      {value: '0%', duration: 1000},
      {value: '4%', duration: 300},
      {value: '4%', duration: 1000},
      {value: '4.8%', duration: 300},
      {value: '4.8%', duration: 1400},
      {value: '20%', duration: 300},
      {value: '20%', duration: 1000},
      {value: '20%', duration: 300},
      {value: '12%', duration: 300},
      {value: '10%', duration: 300},
      {value: '10%', duration: 500},
      {value: '-20%', duration: 300},
      {value: '-18%', duration: 300},
      {value: '-20%', duration: 300},
      {value: '-20%', duration: 1000},
      {value: '7%', duration: 300},
      {value: '7%', duration: 1000},
      {value: '28%', duration: 300},
      {value: '28%', duration: 300},
      {value: '28%', duration: 1000},
      {value: '33%', duration: 300},
      {value: '33%', duration: 300},
      {value: '33%', duration: 1000},
      {value: '13%', duration: 300},
      {value: '13%', duration: 300},
      {value: '0%', duration: 300},
    ]
  });
  
  let irisTimeline = anime.timeline({loop: true});
    irisTimeline.add({
    targets: iris,
    easing: 'cubicBezier(0.41, 0.15, 0, 1)',
    scale: [
      {value: '1', duration: 2000},
      {value: '1.1', duration: 600},
      {value: '1.1', duration: 1000},
      {value: '1', duration: 600},
      {value: '1', duration: 2000},
      {value: '0.8', duration: 600},
      {value: '0.8', duration: 1000},
      {value: '1', duration: 600}
    ]
  });
}

animateEyeball();