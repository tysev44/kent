const timeline = gsap.timeline();
const captions = document.querySelectorAll(".caption");
const faces = document.querySelectorAll(".face");

// Repeats animations for all 5 faces/captions
for (let i = 0; i < 5; i++) {
  const caption = captions[i];
  const face = faces[i];
  // Scroll in
  // Only applied after first
  if (i > 0) {
    timeline.add(
      gsap.to(caption, {
        y: "-=200",
        opacity: 1,
        ease: "power1.out",
        duration: 1.5
      }),
      "-=0.8"
    );
    timeline.add(
      gsap.to(face, {
        opacity: 1,
        ease: "none",
        duration: 1.5
      }),
      "-=1.4"
    );
  }
  // Scroll away
  // Only applied before last
  if (i < 4) {
    timeline.add(
      gsap.to(caption, {
        y: "-=160",
        ease: "power1.in",
        duration: 1.5
      })
    );
    timeline.add(
      gsap.to(caption, {
        opacity: 0,
        ease: "power1.in"
      }),
      "-=0.6"
    );
  }
}

// Creates scroll controlled animation
ScrollTrigger.create({
  trigger: "body",
  animation: timeline,
  end: "+=1200",
  scrub: true,
  pin: true
  // markers: true
});
