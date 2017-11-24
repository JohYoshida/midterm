$( ' document' ).ready(() => {
  console.log('hddukg!weef!');
  $( '.btn-primary').click((event) => {
    console.log('hello!');
    event.preventDefault();
    let dataString = $("#new-poll").serialize();
    $( '.panel-default' ).replaceWith( "<p>Hello</p>" );
    $.ajax({
      url: '/',
      method: 'POST',
      data: dataString,
      success: function (morePostsHtml) {
      console.log('Success: ', morePostsHtml);
      $button.replaceWith(morePostsHtml);
      }
    });
  });
});
