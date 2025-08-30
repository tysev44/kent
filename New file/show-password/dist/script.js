document
  .getElementsByClassName("js-unmask")[0]
  .addEventListener("click", function() {
    const field = this.parentNode.querySelector(".js-inputField");
    field.type = field.type == "password" ? "text" : "password";
  });