gsap.registerPlugin(Flip);

let mouse = { x: 0, y: 0 },
  cursor = document.getElementById("cursor"),
  totalCompletion = 0,
  numbers = document.querySelectorAll(".inner"),
  boxes = document.querySelectorAll(".ready"),
  wrap = document.getElementById("wrap");

document.addEventListener("mousemove", (e) => {
  mouse = { x: e.pageX, y: e.pageY };
  cursor.style.left = mouse.x + "px";
  cursor.style.top = mouse.y + "px";
});

document.addEventListener("mousemove", (e) => {
  numbers.forEach((num) => {
    let numPos = num.getBoundingClientRect();
    x0 = numPos.left;
    y0 = numPos.top;
    x1 = mouse.x;
    y1 = mouse.y;
    distancex = x1 - x0;
    distancey = y1 - y0;
    distance = Math.sqrt(distancex * distancex + distancey * distancey);
    num.style.setProperty("--distance", parseInt(distance));
    num.parentNode.setAttribute("data-distance", parseInt(distance));
  });
});

boxes.forEach((box) => {
  const boxTotal = Math.floor(Math.random() * (55 - 0 + 1)) + 30;
  box.setAttribute("data-percent", boxTotal);
  box.style.setProperty("--total", boxTotal + "%");
});

numbers.forEach((num) => {
  num.setAttribute("data-number", Math.floor(Math.random() * (9 - 0 + 1)) + 0);
  num.addEventListener("click", (e) => {
    wrap.classList.add("noclick");
    totalCompletion = 0;
    let selectedBox = Math.floor(
      Math.random() * (document.getElementsByClassName("valid").length / 2)
    );
    let box = document.getElementsByClassName("valid")[selectedBox];
    let lowerBox = document.getElementsByClassName("valid")[
      selectedBox + document.getElementsByClassName("valid").length / 2
    ];
    let boxTotal = lowerBox.getAttribute("data-percent");
    lowerBox.classList.add("loaded");
    const boxMult = Math.floor(Math.random() * (15 - 0 + 1)) + 1;
    setTimeout(() => {
      lowerBox.setAttribute(
        "data-percent",
        Math.min(parseInt(boxTotal) + boxMult, 100)
      );
      lowerBox.style.setProperty(
        "--total",
        Math.min(parseInt(boxTotal) + boxMult, 100) + "%"
      );
      if (parseInt(boxTotal) + boxMult > 99) {
        box.classList.remove("valid");
        lowerBox.classList.remove("valid");
      }
      boxes.forEach((box) => {
        const boxPercent = box.getAttribute("data-percent");
        totalCompletion += parseInt(boxPercent);
        if (totalCompletion / 5 >= 99) {
          document.body.classList.add("waffleparty");
          setTimeout(() => {
            document.body.classList.remove("loaded");
          }, 2000);
        }
      });
      document
        .getElementById("inner")
        .setAttribute("data-completion", Math.trunc(totalCompletion / 5) + "%");
    }, 1000);
    setTimeout(() => {
      wrap.classList.remove("noclick");
    }, 1500);

    numbers.forEach((num) => {
      if (num.parentNode.getAttribute("data-distance") < 100) {
        num.classList.remove("new");
        const state = Flip.getState(num);
        const parent = num.parentNode;

        box.classList.add("open");
        box.appendChild(num);
        Flip.from(state, {
          duration: 1,
          ease: "back.in(1.5)",
          absolute: true,
          delay: Math.random() / 3,
          onComplete: () => {
            num.classList.add("new");
            num.setAttribute(
              "data-number",
              Math.floor(Math.random() * (9 - 0 + 1)) + 0
            );
            parent.appendChild(num);
            box.classList.remove("open");
          }
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  boxes.forEach((box) => {
    const boxPercent = box.getAttribute("data-percent");
    totalCompletion += parseInt(boxPercent);
  });
  document
    .getElementById("inner")
    .setAttribute("data-completion", Math.trunc(totalCompletion / 5) + "%");
  document.body.classList.add("loaded");
  const waffleparty = "waffle party! ".split("");
  let splitWaffle = "";
  waffleparty.forEach(function (char, index) {
    splitWaffle +=
      char.trim() === ""
        ? ""
        : "<span style='--index: " +
          index +
          "' data-char='" +
          char +
          "'>" +
          char +
          "</span>";
  });
  document
    .getElementById("waffleparty")
    .style.setProperty("--length", waffleparty.length);
  document.getElementById("waffleparty").innerHTML += splitWaffle;
});