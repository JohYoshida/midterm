$(() => {
  let i = 3;
  function addInputGroup() {
    var lastOption = $(".input-group").last().children(".option");
    lastOption.on("focus", event => {
      var created = false;
      //keydown rather then keypress incase they copy and paste into the field
      $(".option").on("keydown", event => {

        var optionVal = lastOption.val();
        if (!optionVal) {
          if (!created) {
            created = true;
            $(".button").before($("<div class='input-group'></div>")
            .append($(`<label for='option-${i}'>Option ${i}</label>`))
            .append($(`<input id="option-${i}" class='option form-control' type='text' name='option' value='' placeholder='Enter poll option'>`))
            .append($("<input class='option form-control' type='text' name='description' value='' placeholder='description'>")));

            $(".option").off();
            addInputGroup();
            i++
          }
        }
      });
    });
  }
  addInputGroup()

});
