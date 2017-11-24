$(() => {
  $(".alert-danger").hide();
  $(".buttons").hide();
  $(".btn").on("click", event => {
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
      $(".form").hide();
      let dataString = $("#new-poll").serialize();
      $.ajax({
        url: '/',
        method: 'POST',
        data: dataString,
        success: function (morePostsHtml) {
          console.log('Success: ', morePostsHtml);
          $button.replaceWith(morePostsHtml);
        }
      });
    }
  });
});
