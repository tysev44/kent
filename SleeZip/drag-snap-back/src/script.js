Draggable.create(".abstract", {
  type: "x,y",
  onDragEnd: function () {
    gsap.to(this.target, {
      x: 0,
      y: 0,
      ease: "elastic.out(0.7, 0.7)"
    });
  }
});
