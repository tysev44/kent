lucide.createIcons();

const playAnimation = () => {
  gsap.fromTo(
    ".card",
    {
      scale: 0
    },
    {
      scale: 1,
      stagger: 0.06,
      ease: "elastic.out(1, 0.8)",
      delay: 0.5
    }
  );
};
playAnimation();

document.querySelector("#replay-btn").addEventListener("click", playAnimation);
