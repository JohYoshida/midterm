$(() => {
  $(".alert-danger").hide();
  $(".btn").on("click", event => {
    event.preventDefault();
    $(".alert-danger").empty();

    var title = $("#poll-title").val();
    if (!title) {
      $(".alert-danger").slideDown().append("<p>Poll must have a title!</p>")
    }

    var email = $("#poll-email").val();
    if (!email) {
      $(".alert-danger").slideDown().append("<p>Please include your email!</p>")
    }
  });
});
// <div class='input-group'></div>
