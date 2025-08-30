gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);
gsap.from('.cls-1', { duration: 3, drawSVG: 0, ease: 'expoScale(0.5,7,none)' });
gsap.to('.pen', {
  motionPath: {
    path: '.cls-1',
    align: '.cls-1',
    alignOrigin: [0.27, 0.73],
  },
  ease: "expoScale(0.5,7,none)",
  duration: 3,
});