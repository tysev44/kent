const DOT_AMOUNT = 60;

const createSVG = (width, height, className, childType, childAttributes) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.classList.add(className);

  const child = document.createElementNS(
    "http://www.w3.org/2000/svg",
    childType
  );

  svg.setAttributeNS(
    "http://www.w3.org/2000/svg",
    "viewBox",
    `0 0 ${width} ${height}`
  );

  for (const attr in childAttributes) {
    child.setAttribute(attr, childAttributes[attr]);
  }

  svg.appendChild(child);

  return { svg, child };
};

document.querySelectorAll(".generate-button").forEach((button) => {
  // create timeline
  const tl = gsap.timeline();

  const width = button.offsetWidth;
  const height = button.offsetHeight;

  const style = getComputedStyle(button);

  // make button dots svg
  const { svg, child: circle } = createSVG(width, height, "dots", "circle", {
    cx: "0",
    cy: "0",
    r: "0"
  });

  for (var i = 0; i < DOT_AMOUNT; i++) {
    var p = circle.cloneNode(true);
    svg.appendChild(p);

    gsap.set(p, {
      attr: {
        cx: gsap.utils.random(width * 0.25, width * 0.75),
        cy: gsap.utils.random(height * 0.5, height * 0.75),
        r: 0
      }
    });

    var durationRandom = gsap.utils.random(10, 12);

    var dotsTL = gsap.timeline();
    dotsTL
      .to(
        p,
        {
          duration: durationRandom,
          rotation: i % 2 === 0 ? 200 : -200,
          attr: {
            r: gsap.utils.random(0.75, 1.5),
            cy: -width * gsap.utils.random(1.25, 1.75)
          },
          physics2D: {
            angle: -90,
            gravity: gsap.utils.random(-4, -8),
            velocity: gsap.utils.random(10, 25)
          }
        },
        "-=" + durationRandom / 2
      )
      .to(
        p,
        {
          duration: durationRandom / 3,
          attr: {
            r: 0
          }
        },
        "-=" + durationRandom / 4
      );

    tl.add(dotsTL, i / 3);
  }

  svg.removeChild(circle);

  // make button stroke svg
  const strokeGroup = document.createElement("div");
  strokeGroup.classList.add("stroke");
  const { svg: stroke } = createSVG(width, height, "stroke-line", "rect", {
    x: "0",
    y: "0",
    width: "100%",
    height: "100%",
    rx: parseInt(style.borderRadius, 10),
    ry: parseInt(style.borderRadius, 10),
    pathLength: "10"
  });
  button.appendChild(svg);
  strokeGroup.appendChild(stroke);
  strokeGroup.appendChild(stroke.cloneNode(true));
  button.appendChild(strokeGroup);

  const finalTL = gsap.to(tl, {
    duration: 10,
    repeat: -1,
    time: tl.duration(),
    paused: true
  });

  const icon = gsap.to(button, {
    repeat: -1,
    repeatDelay: 0.75,
    paused: true,
    keyframes: [
      {
        "--generate-button-icon-2-opacity": ".25",
        duration: 0.3
      },
      {
        "--generate-button-icon-1-opacity": ".5",
        "--generate-button-icon-2-opacity": ".5",
        duration: 0.3
      },
      {
        "--generate-button-icon-1-opacity": ".25",
        "--generate-button-icon-2-opacity": "1",
        duration: 0.3
      }
    ]
  });

  // hover 
  button.addEventListener("pointerenter", () => {
    gsap.to(
      button,
      {
        "--generate-button-dots-opacity": ".5",
        duration: 0.25,
        onStart: () => {
          finalTL.restart().play();
          setTimeout(() => icon.restart().play(), 500);
        }
      }
    );
  });

  // end hover
  button.addEventListener("pointerleave", () => {
    gsap.to(button, {
      "--generate-button-dots-opacity": "0",
      "--generate-button-icon-1-opacity": ".25",
      "--generate-button-icon-1-scale": "1",
      "--generate-button-icon-2-opacity": "1",
      "--generate-button-icon-2-scale": "1",
      duration: 0.15,
      onComplete: () => {
        finalTL.pause();
        icon.pause();
      }
    });
  });
});