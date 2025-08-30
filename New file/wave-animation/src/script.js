/*
No JavaScript used for the animation.

Just to handle the toggle of the "state" showing 
how the animation actually works.
*/

let waveContainer = document.querySelector(".wave-container");
let button = document.querySelector("button");

button.addEventListener("click", function (e) {
	e.preventDefault();
	waveContainer.classList.toggle("js-show-solution");
});
