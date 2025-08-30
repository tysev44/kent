const timeline = gsap.timeline();
timeline.add(gsap.fromTo("#circle", { rotation: 30 }, { rotation: -30 }), 0);

ScrollTrigger.create({
  trigger: "main",
  animation: timeline,
  scrub: 0.7,
  pin: true
});
