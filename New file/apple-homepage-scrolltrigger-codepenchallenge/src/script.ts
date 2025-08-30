gsap.registerPlugin(ScrollTrigger);

const textTitles = [...document.querySelectorAll("h1")];
console.log(textTitles);

gsap.timeline({
  scrollTrigger: {
    trigger: ".phone",
    start: "center center",
    end: "center 60%",
    endTrigger: ".text__last",
    pinSpacing: true,
    pin: true
  }
});

textTitles.forEach((title, i) => {
  gsap.to(title, {
    opacity: 1,
    scrollTrigger: {
      trigger: title,
      start: "top 55%",
      end: "top 10%",
      scrub: true,
      toggleClass: {
        targets: ".phone",
        className: `phone${i - 1}`
      }
    }
  });
});
