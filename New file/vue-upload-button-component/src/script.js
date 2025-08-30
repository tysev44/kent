new Vue({
  el: "#app",
  name: "SubmitButton",
  data() {
    return {
      loading: false,
      done: false,
      text: "Upload"
    };
  },
  methods: {
    buttonClick: function () {
      if (!this.loading) {
        this.loading = true;
        this.text = "Uploading";
        setTimeout(() => {
          this.done = true;
          this.text = "Uploaded";
          setTimeout(() => {
            this.loading = false;
            this.done = false;
            this.text = "Upload";
          }, 2000);
        }, 2000);
      }
    }
  }
});
