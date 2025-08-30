const images = document.querySelector('.images');

gsap.globalTimeline.timeScale(1);

images.addEventListener('click', () => {
  tween.restart();
})

const tween = gsap.to(images, {
  paused: true,
  duration: 1,
  ease: "power1.inOut",
  "--flip-rotate": "0deg",
  "--flip-offset": "100%",
  "--flip-shadow-opacity": "0",
  onUpdate: () => {
    const { firstElementChild } = images;
    const bound = firstElementChild.getBoundingClientRect(); 

    images.style.setProperty('--flip-round', `${((bound.height - firstElementChild.offsetHeight) * .875)}px`);
  },
  keyframes: [
    {
      "--flip-rotate": "6deg",
      "--flip-shadow-opacity": "1",
      '--flip-z': '15px',
      '--flip-skew': '1.5deg',
      '--flip-round': '20px',
      "--flip-shadow-back-opacity": "1",
      duration: .4,
    },
    {
      "--flip-rotate": "2deg",
      '--flip-skew': '-2.5deg',
      "--flip-shadow-opacity": "1",
      '--flip-overlay': '.2',
    },
    {
      "--flip-rotate": "0deg",
      '--flip-z': '0px',
      '--flip-skew': '0deg',
      '--flip-round': '0px',
      "--flip-shadow-opacity": "0",
      onStart: () => {
        gsap.to(images, {
          "--flip-shadow-back-opacity": "0",
          '--flip-overlay': '0',
          duration: .2,
          delay: .1
        })
      }
    },
  ],
  onComplete: () => {
    const frontImage= document.querySelector('.front img');
    const backImage= document.querySelector('.back img');
    const tempSrc = frontImage.src;

    frontImage.src = backImage.src;
    backImage.src = tempSrc;
  },
  clearProps: true,
});