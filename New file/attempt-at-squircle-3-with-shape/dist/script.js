const jibber = document.getElementById("jibber");
const jabber = document.getElementById("jabber");

jibber.addEventListener("input", (e) => {
  console.log(jibber.value);
  document.documentElement.style.setProperty("--inset", jibber.value + "%");
});

jabber.addEventListener("input", (e) => {
  console.log(jabber.value);
  document.documentElement.style.setProperty("--size", jabber.value + "%");
});