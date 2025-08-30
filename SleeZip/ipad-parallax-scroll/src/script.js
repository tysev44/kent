const timeline = gsap.timeline();
timeline
  .add(gsap.to("#ipad", { rotationX: 10 }), 0)
  .add(gsap.to("#images", { y: -808 }), 0);

ScrollTrigger.create({
  trigger: "#wrapper",
  animation: timeline,
  scrub: 1,
  pin: true
});
