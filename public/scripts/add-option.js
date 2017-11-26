$(document).ready(function() {
  var i = 3;
  function addInputGroup() {
    var lastOption = $('.input-group').last().children('.option');
    lastOption.on('focus', function(event) {
      var created = false;
      $('.option').on('keypress', function(event) {
        var optionVal = lastOption.val();
        if (!optionVal) {
          if (!created) {
            created = true;
            $('.button').before($('<div class="input-group"></div>')
              .append($('<label for="option-' + i + '">Option ' + i + '</label>'))
              .append($('<input id="option-' + i + '" class="option form-control" type="text" name="option" value="" placeholder="Enter poll option">'))
              .append($('<input class="option form-control" type="text" name="description" value="" placeholder="description">')));

            $('.option').off();
            addInputGroup();
            i++;
          }
        }
      });
    });
  }
  addInputGroup();

});
