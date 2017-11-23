$(() => {

  function addInputGroup() {
    $(".input-group").last().children(".option").on("focus", event => {
      var created = false;
      $(".option").on("keypress", event => {
        var option = $(".option").val();
        if (!option) {
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
