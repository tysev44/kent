document.querySelector("button").addEventListener("click", () => {
	const text = "You clicked the button";
	const utterance = new SpeechSynthesisUtterance(text);

	window.speechSynthesis.speak(utterance);
});