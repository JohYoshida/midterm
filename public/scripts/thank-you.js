$(() => {
  $("#options-submit").on("click", event => {
    event.preventDefault();

    $('.results-form').slideUp('slow', function(){
      $('.form-cont').append('<div class="panel">Thank you for your submission</div>');
    });
  });

});
