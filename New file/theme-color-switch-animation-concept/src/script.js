const colors = [
  '#707bea',
  '#e7a9f3',
  '#80daa4',
  '#eda692',
  '#64b9d4',
  '#f3b264',
  '#7d4baf',
  '#e66b66'
];

let currentColorValue = 0;
let newColor = 1;

const RAW_STEP1 = [
  'M15.25 3.3C15.25 4.03605 14.0591 4.49863 12.283 4.86019C11.9774 4.9224 12.5 8.5 12.2913 10.5C12 11.5 9.5 12.282 9.5 9C9.5 9 8.5 9 8.5 8.5C8 7.5 8.52034 5.18332 8.04024 5.18332C5.5 5 2.75 4.43218 2.75 3.3C2.75 2.16782 5.54822 1.25 9 1.25C12.4518 1.25 15.25 2.16782 15.25 3.3Z',
  'M15.25 3.3C15.25 4.03605 15.25 4.32972 15.25 4.84105C15.25 5.35237 15.2141 6.88041 15.25 9C14.9587 10 13.7863 9.15138 13.2863 7.15138C13.2863 7.15138 12.6879 7.12536 12.4537 6.63973C11.9537 5.63973 12.1457 4.8706 11.6126 4.94867C7.11255 5.60763 2.75 4.7232 2.75 3.3C2.75 2.16782 5.54822 1.25 9 1.25C12.4518 1.25 15.25 2.16782 15.25 3.3Z',
  'M15.25 3.3C15.25 4.03605 15.25 4.32972 15.25 4.84105C15.25 5.35237 15.2123 4.42282 15.2482 6.54241C14.9569 7.54241 15.5726 7.93877 15.0726 5.93877C15.0726 5.93877 13.9678 6.45733 13.7336 5.9717C13.2336 4.9717 12.8592 4.82301 12.3288 4.91808C7.67532 5.7522 2.75 4.7232 2.75 3.3C2.75 2.16782 5.54822 1.25 9 1.25C12.4518 1.25 15.25 2.16782 15.25 3.3Z',
  'M15.25 3.3C15.25 4.03605 15.25 4.32972 15.25 4.84105C15.25 5.35237 15.2123 4.42282 15.2482 6.54241C15.2097 7.63544 15.3274 7.54914 15.2254 5.53304C15.2254 5.53304 15.1941 3.61108 14.9901 4.05038C14.3021 4.29078 12.8592 4.82301 12.3288 4.91808C7.67532 5.7522 2.75 4.7232 2.75 3.3C2.75 2.16782 5.54822 1.25 9 1.25C12.4518 1.25 15.25 2.16782 15.25 3.3Z',
];

const RAW_STEP2 = [
  'M15.25 3.3C15.25 4.03605 14.4432 4.33564 12.5748 4.7932C12.3206 4.8631 11.9774 4.90759 11.4245 5.01563C10.9606 5.0474 11.0369 5.06647 10.3887 5.11731C10.3887 5.11731 9.95019 5.14273 9.37824 5.14908C8.6912 5.15671 8.46659 5.13637 7.98649 5.13637C5.45594 5.04808 2.75 4.43218 2.75 3.3C2.75 2.16782 5.54822 1.25 9 1.25C12.4518 1.25 15.25 2.16782 15.25 3.3Z',
  'M15.25 3.3C15.25 4.03605 14.0591 4.49863 12.283 4.86019C11.9774 4.9224 11.9628 6.01197 11.9628 7.01197C11.8109 8.24565 10.0648 7.80912 10.2261 6.04401C10.2261 6.04401 10.0865 5.26143 9.59032 5.19941C8.90705 5.114 8.52034 5.18332 8.04024 5.18332C5.50968 5.09502 2.75 4.43218 2.75 3.3C2.75 2.16782 5.54822 1.25 9 1.25C12.4518 1.25 15.25 2.16782 15.25 3.3Z',
  'M15.25 3.3C15.25 4.03605 14.0591 4.49863 12.283 4.86019C11.9774 4.9224 12.2087 6 12 8C11.7087 8.5 10 9.5 9.5 7C9.5 7 8.5 7 8.5 6.5C8.5 5.5 8.52034 5.18332 8.04024 5.18332C5.5 5 2.75 4.43218 2.75 3.3C2.75 2.16782 5.54822 1.25 9 1.25C12.4518 1.25 15.25 2.16782 15.25 3.3Z',
  'M15.25 3.3C15.25 4.03605 14.0591 4.49863 12.283 4.86019C11.9774 4.9224 12.5 8.5 12.2913 10.5C12 11.5 9.5 12.282 9.5 9C9.5 9 8.5 9 8.5 8.5C8 7.5 8.52034 5.18332 8.04024 5.18332C5.5 5 2.75 4.43218 2.75 3.3C2.75 2.16782 5.54822 1.25 9 1.25C12.4518 1.25 15.25 2.16782 15.25 3.3Z',
];

const random = (min, max) => min + Math.random() * (max - min);

gsap.registerPlugin(MorphSVGPlugin, Physics2DPlugin);

const main = document.querySelector('main');
const loaderMain = document.querySelector('.splash-loader');
const circle = document.querySelector('.circle');
const bucketDefault = document.querySelector('.bucket.default');
const bucketNew = document.querySelector('.bucket.new');
const midDot = loaderMain.querySelector('.middle');
const INIT_DELAY = 2;
const PAUSE_DELAY = 2;
const MORPH_PER = 0.2;
const RAW1_DUR = RAW_STEP1.length * MORPH_PER;
const SCALE_IN = 0.2;
const SQUASH_BACK = 0.2;
const DROP_DUR = RAW1_DUR - SCALE_IN - SQUASH_BACK;

const h = loaderMain.offsetHeight + midDot.offsetHeight / 2;

gsap.set(main, {
  '--color': colors[newColor],
  '--bucket-color': colors[currentColorValue],
  '--bucket-new-color': colors[currentColorValue],
})

function droplet(quantity, elementAdd) {
  for(let i = 0; i < quantity; i++) {
    const d = document.createElement('div');

    d.className = 'dot-2';

    elementAdd.appendChild(d);

    gsap.set(d, {
      x: 0,
      y: elementAdd.offsetHeight + d.offsetHeight,
      opacity: 1,
      scale: random(.3, .5)
    });

    gsap.timeline({
      onComplete: () => d.remove()
    }).to(d, {
      physics2D: {
        angle: random(-115, -65),
        velocity: random(100, 120),
        gravity: 180
      },
      duration: .5
    }).to(d, {
      opacity: 0,
      duration: .2
    }, .3);
  }
}

document.querySelectorAll('.splash-loader-default').forEach(loader => {
  const midDot = loader.querySelector('.middle');
  const loaderH = loader.offsetHeight;
  const scale = Number(loader.dataset.scale);
  const delay = Number(loader.dataset.initial);

  gsap.set(loader, {
    scale
  })

  gsap.set(midDot, {
    scaleX: .1,
    scaleY: .2,
    opacity: 0,
    delay
  });

  gsap.timeline({
    repeat: -1,
    repeatDelay: Number(loader.dataset.delay),
    delay,
  }).to(midDot, {
    scaleX: .75,
    scaleY: 1.25,
    opacity: 1,
    duration: .2
  }, 0).to(midDot, {
    scaleY: 1,
    duration: .2
  },.2).to(midDot, {
    y: loaderH + midDot.offsetHeight / 2,
    duration: .4,
    ease: 'power1.in',
    onComplete: () => {
      droplet(6, loader);

      loader.dataset.delay = Number(loader.dataset.repeat);
    }
  }, 0).to(midDot, {
    opacity: 0,
    scale: 0,
    duration: .15
  }, .45);
})

for(let i=0; i < 8; i++) {
  gsap.set(circle.querySelector(`:nth-child(${i + 1})`), {
    backgroundColor: colors[i]
  });
}

const bucketStep1 = gsap.timeline().set('.bucketPath', {
  attr: { 
    d: RAW_STEP1[0] 
  } 
}).to('.bucketPath', { 
  morphSVG:{
    shape: RAW_STEP1[1],
    shapeIndex: 'auto'
  }, duration: MORPH_PER 
}).to('.bucketPath', {
  morphSVG: {
    shape: RAW_STEP1[2],
    shapeIndex: 'auto'
  },
  duration: MORPH_PER
}).to('.bucketPath', {
  morphSVG: {
    shape: RAW_STEP1[3],
    shapeIndex: 'auto'
  },
  duration: MORPH_PER,
  onComplete: () => {
    gsap.set(main, {
      '--bucket-new-color': colors[newColor],
    });

    gsap.fromTo(main, {
      '--bucket-scale': '0px',
    }, {
      '--bucket-scale': '24px',
      duration: .5,
      keyframes: [{
        '--bucket-y': '2px',
        duration: .125
      }, {
        '--bucket-y': '0px',
        duration: .275
      }],
      onComplete: () => {
        gsap.set(main, {
          '--bucket-scale': '0px',
          '--bucket-color': colors[newColor],
        })
      }
    });
  }
});

const getIndex = (value) => {
  return (value === colors.length - 1) ? 0 : (value + 1);
}

const bucketStep2 = gsap.timeline().set('.bucketPath', {
  attr: {
    d: RAW_STEP2[0]
  }
}).to('.bucketPath', {
  morphSVG: {
    shape: RAW_STEP2[1],
    shapeIndex: 'auto'
  },
  duration: MORPH_PER
}).to('.bucketPath', {
  morphSVG: {
    shape: RAW_STEP2[2],
    shapeIndex: 'auto'
  },
  duration: MORPH_PER
}).to('.bucketPath', {
  morphSVG: {
    shape: RAW_STEP2[3],
    shapeIndex: 'auto'
  },
  duration: MORPH_PER,
  onComplete: () => {
    gsap.to(circle, {
      rotate: '-=45deg',
      duration: .75,
      ease: 'elastic(1, .75)',
      onComplete: () => {
        currentColorValue = getIndex(currentColorValue);
        newColor = getIndex(newColor);
        gsap.set(main, {
          '--color': colors[newColor],
        })
      }
    })
  },
});

const splashTl = gsap.timeline().set(midDot, {
  scaleX: .1,
  scaleY: .2,
  opacity: 0,
}).to(midDot, {
  scaleX: .75,
  scaleY: 1.25,
  opacity: 1,
  duration: SCALE_IN,
}).to(midDot, {
  scaleY: 1,
  duration: SQUASH_BACK
}, '>').to(midDot, {
  y: h,
  duration: DROP_DUR,
  ease: 'power1.in',
  onComplete: () => {
    droplet(6, loaderMain);
  }
}, '<').set(midDot, {
  opacity: 0,
  scale: 0
});

gsap.timeline({
  repeat: -1,
  repeatDelay: PAUSE_DELAY,
  delay: INIT_DELAY,
}).add(bucketStep1, 0).add(splashTl, 0).add(bucketStep2, RAW1_DUR);
