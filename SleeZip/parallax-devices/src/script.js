/**
 * Hi all!
 * The vast majority of this code is scroll timeline tweens.
 * I labeled each scroll timeline section with what it is doing
 * As you scroll down the code, the tweens play in order of
 * what happens when scrolling on the site.
 *
 * Comment for any clarification, I'd be happy to assist!
 * Thanks for checking this out!
 *
 * My Portfolio: https://bento.me/gibsonmurray
 * Inspiration: https://natesmith.design/
 */

/* <----- SECTION I: INITIAL POSITIONS OF ELEMENTS -----> */

// --- INITIAL POSITIONS OF IPHONE 1 TEXT ---
gsap.set(".txt", {
  y: "+=160"
});
gsap.set(".lets", {
  x: "-=39"
});
gsap.set(".hf", {
  x: "+=20"
});
gsap.set(".bc", {
  x: "+=20"
});
gsap.set(".explore", {
  x: "+=20"
});
gsap.set(".bc, .explore", {
  rotateX: "-=90"
});

// --- INITIAL POSITIONS OF IPHONE 2 ---
gsap.set(".iphone2 > .layer1", {
  x: "+=30"
});
gsap.set(".iphone2 > .layer2", {
  x: "+=60"
});
gsap.set(".iphone2 > .layer3", {
  x: "+=90"
});
gsap.set(".iphone2 > .layer4", {
  x: "+=120"
});
gsap.set(".iphone2 > *", {
  rotateY: "+=90"
});

// --- INITIAL POSITIONS OF TV ---
gsap.set(".tv1 > *", {
  rotateX: "-=90",
  rotateZ: "-=60"
});
gsap.set(".tv1 > .layer1", {
  x: "+=30",
  y: "+=30"
});
gsap.set(".tv1 > .layer2", {
  x: "+=60",
  y: "+=60"
});
gsap.set(".tv1 > .layer3", {
  x: "+=90",
  y: "+=90"
});
gsap.set(".tv1 > .layer4", {
  x: "+=120",
  y: "+=120"
});

// --- INITIAL POSITIONS OF MACBOOK ---
gsap.set(".macbook1", {
  y: "+=50"
});
gsap.set(".macbook1 > .layer1", {
  y: "+=30"
});
gsap.set(".macbook1 > .layer2", {
  y: "+=60"
});
gsap.set(".macbook1 > .layer3", {
  y: "+=90"
});
gsap.set(".macbook1 > .layer4", {
  y: "+=120"
});
gsap.set(
  ".macbook1 > .layer1, .macbook1 > .layer2, .macbook1 > .layer3, .macbook1 > .layer4",
  {
    rotateX: "-=90"
  }
);
gsap.set(".macbook1 > .base", {
  y: "-=90",
  z: "-=700"
});

// --- INITIAL TRANSITION TO SHOW FIRST IPHONE ---
const initAnimation = gsap
  .timeline()
  .set(".iphone1", {
    scale: 0.9,
    y: "+=50"
  })
  .to(".iphone1", {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1,
    ease: "elastic.out(1, 0.8)",
    delay: 1
  })
  .fromTo(
    ".layer2 > .mouse, .layer2 > .arrows",
    {
      opacity: 0
    },
    {
      opacity: 1
    },
    "<0.5"
  )
  .fromTo(
    ".layer2 > span",
    {
      opacity: 0
    },
    {
      opacity: 1
    },
    "<0.3"
  )
  .to(
    ".layer2 > .arrows",
    {
      y: "+=10",
      ease: "sine.inOut",
      duration: 1.3,
      repeat: -1,
      yoyo: true
    },
    0
  );

/* <----- SECTION 2: ANIMATIONS / TWEENS ----> */

// --- INIT TIMELINE AND FIRST IPHONE TEXT ---
const scroll = gsap
  .timeline({
    scrollTrigger: {
      trigger: "body",
      scrub: 0.5,
      pin: true,
      end: "+=6500" // length of animation determined by length of scroll
    },
    defaults: { ease: "none" } // gsap defaults to an ease of "power1.out"
  })
  .to(".iphone1 > .layer3", {
    bottom: 0
  })
  .to(
    ".iphone1 > .layer4 > .home-bar",
    {
      backgroundColor: "#f0f1f6",
      duration: 0.008
    },
    "<0.004"
  )
  .to(
    ".iphone1 > .layer2",
    {
      scale: 0.89,
      duration: 0.35
    },
    "<0.15"
  )
  .to(".iphone1 > .layer4 > .hw", {
    opacity: 1,
    y: "-=100",
    rotateX: 360,
    ease: "elastic.out(1, 1)"
  })
  .to(".lets, .hf", {
    opacity: 1,
    y: "-=10"
  })
  .to(".hf", {
    rotateX: "+=90",
    y: "-=10",
    opacity: 0
  })
  .to(
    ".bc",
    {
      rotateX: "+=90",
      y: "-=10",
      opacity: 1
    },
    "<"
  )
  .to(
    ".lets",
    {
      x: "-=7"
    },
    "<"
  )
  .to(".bc", {
    rotateX: "+=90",
    y: "-=10",
    opacity: 0
  })
  .to(
    ".explore",
    {
      rotateX: "+=90",
      y: "-=10",
      opacity: 1
    },
    "<"
  )
  .to(
    ".lets",
    {
      x: "+=4"
    },
    "<"
  );

// --- TRANSITION TO NEXT IPHONE ---
scroll
  .set(".iphone1", {
    overflow: "visible"
  })
  .to(".iphone1 > *", {
    rotateY: -90,
    delay: 1.2
  })
  .to(
    ".iphone1 > .layer1",
    {
      x: "-=30"
    },
    "<"
  )
  .to(
    ".iphone1 > .layer2",
    {
      x: "-=60"
    },
    "<"
  )
  .to(
    ".iphone1 > .layer3",
    {
      x: "-=90"
    },
    "<"
  )
  .to(
    ".iphone1 > .layer4",
    {
      x: "-=120"
    },
    "<"
  )
  .to(
    ".iphone1 > *",
    {
      opacity: 0,
      duration: 0.05
    },
    "<0.36"
  )
  .to(
    ".iphone2 > *",
    {
      rotateY: "-=90"
    },
    "<"
  )
  .to(
    ".iphone2",
    {
      opacity: 1,
      duration: 0.05
    },
    "<"
  )
  .to(
    ".iphone2 > .layer1",
    {
      x: "-=30"
    },
    "<"
  )
  .to(
    ".iphone2 > .layer2",
    {
      x: "-=60"
    },
    "<"
  )
  .to(
    ".iphone2 > .layer3",
    {
      x: "-=90"
    },
    "<"
  )
  .to(
    ".iphone2 > .layer4",
    {
      x: "-=120"
    },
    "<"
  );

// --- TRANSITION TO TV ---
scroll
  .to(".iphone2 > *", {
    rotateY: "-=90",
    rotateZ: "+=45",
    delay: 1.2
  })
  .to(
    ".iphone2 > .layer1",
    {
      x: "-=30",
      y: "-=30"
    },
    "<"
  )
  .to(
    ".iphone2 > .layer2",
    {
      x: "-=60",
      y: "-=60"
    },
    "<"
  )
  .to(
    ".iphone2 > .layer3",
    {
      x: "-=90",
      y: "-=90"
    },
    "<"
  )
  .to(
    ".iphone2 > .layer4",
    {
      x: "-=120",
      y: "-=120"
    },
    "<"
  )
  .to(
    ".iphone2 > *",
    {
      opacity: 0,
      duration: 0.05
    },
    "<0.36"
  )
  .to(
    ".tv1 > *",
    {
      rotateX: "+=90",
      rotateZ: "+=60"
    },
    "<"
  )
  .to(
    ".tv1",
    {
      y: "-=30"
    },
    "<"
  )
  .to(
    ".tv1",
    {
      opacity: 1,
      duration: 0.05
    },
    "<"
  )
  .to(
    ".tv1 > .layer1",
    {
      x: "-=30",
      y: "-=30"
    },
    "<"
  )
  .to(
    ".tv1 > .layer2",
    {
      x: "-=60",
      y: "-=60"
    },
    "<"
  )
  .to(
    ".tv1 > .layer3",
    {
      x: "-=90",
      y: "-=90"
    },
    "<"
  )
  .to(
    ".tv1 > .layer4",
    {
      x: "-=120",
      y: "-=120"
    },
    "<"
  )
  .set(
    ".tv1 > .stand",
    {
      opacity: 1
    },
    "<0.2"
  )
  .to(
    ".tv1 > .stand",
    {
      y: "+=40",
      duration: 0.2
    },
    "<0.1"
  );

// --- TRANSITION TO MACBOOK ---
scroll
  .to(".tv1 > *", {
    rotateX: "+=90",
    delay: 1.2
  })
  .to(
    ".tv1 > .layer1",
    {
      y: "-=30"
    },
    "<"
  )
  .to(
    ".tv1 > .layer2",
    {
      y: "-=60"
    },
    "<"
  )
  .to(
    ".tv1 > .layer3",
    {
      y: "-=90"
    },
    "<"
  )
  .to(
    ".tv1 > .layer4",
    {
      y: "-=120"
    },
    "<"
  )
  .to(
    ".tv1 > .stand",
    {
      y: "-=193"
    },
    "<"
  )
  .to(
    ".tv1 > *",
    {
      opacity: 0,
      duration: 0.05
    },
    "<0.36"
  )
  .to(
    ".macbook1 > .layer1, .macbook1 > .layer2, .macbook1 > .layer3, .macbook1 > .layer4",
    {
      rotateX: "+=90"
    },
    "<"
  )
  .to(
    ".macbook1",
    {
      y: "-=50"
    },
    "<"
  )
  .to(
    ".macbook1",
    {
      opacity: 1,
      duration: 0.05
    },
    "<"
  )
  .to(
    ".macbook1 > .layer1",
    {
      y: "-=30"
    },
    "<"
  )
  .to(
    ".macbook1 > .layer2",
    {
      y: "-=60"
    },
    "<"
  )
  .to(
    ".macbook1 > .layer3",
    {
      y: "-=90"
    },
    "<"
  )
  .to(
    ".macbook1 > .layer4",
    {
      y: "-=120"
    },
    "<"
  )
  .set(
    ".macbook1 > .base",
    {
      opacity: 1
    },
    ">-0.4"
  )
  .to(
    ".macbook1 > .base",
    {
      y: "+=90",
      z: "+=700",
      duration: 0.4
    },
    "<"
  );

// --- TRANSITION OUT ---
scroll
  .to(
    ".macbook1 > .layer1, .macbook1 > .layer2, .macbook1 > .layer3, .macbook1 > .layer4",
    {
      rotateX: "+=90",
      delay: 1.2
    }
  )
  .to(
    ".macbook1",
    {
      y: "-=50"
    },
    "<"
  )

  .to(
    ".macbook1 > .layer1",
    {
      y: "-=30"
    },
    "<"
  )
  .to(
    ".macbook1 > .layer2",
    {
      y: "-=60"
    },
    "<"
  )
  .to(
    ".macbook1 > .layer3",
    {
      y: "-=90"
    },
    "<"
  )
  .to(
    ".macbook1 > .layer4",
    {
      y: "-=120"
    },
    "<"
  )
  .to(
    ".macbook1 > .base",
    {
      rotateX: "+=9",
      z: "-=500",
      duration: 0.6
    },
    "<"
  )
  .to(
    ".macbook1 > .base",
    {
      y: "-=260",
      duration: 0.5,
      ease: "sine.in"
    },
    "<"
  )
  .to(
    ".macbook1",
    {
      opacity: 0,
      duration: 0.05
    },
    "<0.43"
  );

// --- TRANSITION TO SHOW ENDING TEXT ---
scroll
  .set(".end-text", {
    display: "none"
  })
  .set(".end-text", {
    display: "flex"
  })
  .to(".end-text", {
    opacity: 1
  });

/* <----- SECTION 3: COMBINING TIMELINES & PLAYING ANIMATION ----> */
const main = gsap.timeline().add(initAnimation).add(scroll);
main.play();
