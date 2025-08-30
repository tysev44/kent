const iphone = document.querySelector(".iphone");
const widgets = document.querySelectorAll(".widgets");

gsap.set(iphone, { x: -450, rotation: 90 });
gsap.set(widgets, { opacity: 0, scale: 0 });

function iPhoneAnimation() {
  const tl = gsap.timeline({ defaults: { duration: 1 } });
  tl.to(iphone, { x: 0 })
    .to(iphone, { rotation: 0, scale: 0.9 })
    .to(iphone, { duration: 3, scale: 1 });
  return tl;
}

function widgetAnimation() {
  const tl = gsap.timeline();
  tl.to(widgets, { duration: 0, opacity: 1 });
  return tl;
}

const animations = [
  {
    selector: "#app-store",
    duration: 3,
    scale: 0.9,
    x: 500,
    y: 100,
    ease: Power4.easeOut
  },
  {
    selector: "#screen-time",
    duration: 3,
    scale: 0.9,
    x: -500,
    y: -300,
    ease: Power2.easeOut
  },
  {
    selector: "#weather",
    duration: 3,
    scale: 1.1,
    x: -400,
    y: 350,
    ease: Power4.easeOut
  },
  {
    selector: "#stocks",
    duration: 3,
    scale: 0.9,
    x: 530,
    y: -170,
    ease: Power4.easeOut
  },
  {
    selector: "#fitness",
    duration: 3,
    scale: 1.1,
    x: -350,
    y: -100,
    ease: Power2.easeOut
  },
  {
    selector: "#find-my",
    duration: 3,
    scale: 1.1,
    x: 400,
    y: -360,
    ease: Power4.easeOut
  },
  {
    selector: "#calendar",
    duration: 3,
    scale: 0.9,
    x: -630,
    y: 0,
    ease: Power2.easeOut
  },

  {
    selector: "#wallet",
    duration: 3,
    scale: 1,
    x: -280,
    y: 100,
    ease: Power4.easeOut
  },
  {
    selector: "#apple-tv",
    duration: 3,
    scale: 1,
    x: 500,
    y: 300,
    ease: Power4.easeOut
  },
  {
    selector: "#sleep",
    duration: 3,
    scale: 0.9,
    x: 270,
    y: -50,
    ease: Power2.easeOut
  },
  {
    selector: "#socials",
    duration: 3,
    scale: 1,
    x: 330,
    y: 120,
    ease: Power2.easeOut
  }
];
const startTime = 2;
const masterTimeline = gsap.timeline();
masterTimeline.add(iPhoneAnimation()).add(widgetAnimation(), startTime);

animations.forEach((animation, index) => {
  const { selector, duration, scale, x, y, ease } = animation;
  const element = document.querySelector(selector);
  masterTimeline.add(
    gsap.to(element, { duration, scale, x, y, ease }),
    startTime + (index % 3) / 2
  );
});

ScrollTrigger.create({
  animation: masterTimeline,
  trigger: ".animation",
  scrub: 1,
  pin: true
  // markers: true
});