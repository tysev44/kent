const button = document.querySelector("button");
const list = document.querySelector(".list");
let listItems = list.querySelectorAll("li");
const listItemButtons = list.querySelectorAll("li > button");

function makeFirstListItemsButtonDisabled() {
  listItems = list.querySelectorAll("li");
  listItems.forEach((item) => {
    item.querySelector("button").disabled = false;
  });
  listItems[0].querySelector("button").disabled = true;
}

listItemButtons.forEach((button) =>
  button.addEventListener("click", async () => {
    const item = button.parentElement;

    item.style.viewTransitionName = "woosh";
    item.querySelector("svg").style.viewTransitionName = "tony-hawk";

    const transition = document.startViewTransition(() => {
      const firstListItem = list.querySelector(".list :first-child");

      list.insertBefore(item, firstListItem);

      // This is probably the better API to use, but less supported...
      // list.moveBefore(item, firstListItem);
    });

    try {
      await transition.finished;
    } finally {
      item.style.viewTransitionName = "";
      item.querySelector("svg").style.viewTransitionName = "";
      makeFirstListItemsButtonDisabled();
    }
  })
);
