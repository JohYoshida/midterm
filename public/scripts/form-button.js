$(() => {
  $(".alert-danger").hide();
  $(".buttons").hide();
  $(".btn").on("click", event => {
    let longurl = '';
    $(".alert-danger").empty().hide();

    var title = $("#poll-title").val();
    var email = $("#poll-email").val();
    if (!title) {
      $(".alert-danger").slideDown().append("<p>Poll must have a title!</p>")
    } else if (!email) {
      $(".alert-danger").slideDown().append("<p>Please include your email!</p>")
    } else {
      event.preventDefault();
      $(".buttons").slideDown();
      $(".form").slideUp();
      let dataString = $("#new-poll").serialize();
      $.ajax({
        url: '/',

        method: 'POST',
        data: dataString,
        success: function(data){
          longurl = JSON.parse(data);
          console.log(longurl.pollRoutePath);
        }
      });
    }
  });
});
