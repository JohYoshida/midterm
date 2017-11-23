$(() => {
  $(".option").on("focus", event => {
    var created = false;
    $(".option").on("keypress", event => {
      console.log("here");
      // var option = $(".option").val();
      if (!created) {
        $(".button").before($("<div class='input-group'></div>")
        .append($("<label for=''>Option</label>"))
        .append($("<input class='option form-control' type='text' name='option' value='' placeholder='option'>"))
        .append($("<input class='option form-control' type='text' name='description' value='' placeholder='description'>")));
        created = true;
      }
    });
  });
});
