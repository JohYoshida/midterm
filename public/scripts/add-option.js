$(() => {

  function addInputGroup() {
    var lastOption = $(".input-group").last().children(".option");
    lastOption.on("focus", event => {
      console.log("last");
      var created = false;
      $(".option").on("keypress", event => {
        console.log("keypress");
        var optionVal = lastOption.val();
        if (!optionVal) {
          if (!created) {
            created = true;
            $(".button").before($("<div class='input-group'></div>")
            .append($("<label for=''>Option</label>"))
            .append($("<input class='option form-control' type='text' name='option' value='' placeholder='option'>"))
            .append($("<input class='option form-control' type='text' name='description' value='' placeholder='description'>")));
            $(".option").off();
            addInputGroup();
          }
        }
      });
    });
  }
  addInputGroup()

});
