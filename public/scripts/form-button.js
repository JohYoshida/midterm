$(document).ready(function() {
  //Hides the alert and poll redirect buttons by default only to be unhiden when actually useful to the user
  $('.alert-danger').hide();
  $('.buttons').hide();

  //If all goes well submits the users inputted information to the server and displays the buttons that redirect them to
  //their voting and results page
  $('#submit').on('click', function(event) {
    event.preventDefault();

    //Defining variable used to hold the specific routePath for the newly created poll
    var routePathUrl = '';

    //Alerts that get displayed if any of the poll's fields are empty. Hidden by default
    $('.alert-danger').empty().hide();

    //Takes the inputted values in the form to and sticks them in variables so they can be checked
    var title = $('#poll-title').val();
    var email = $('#poll-email').val();
    var option1 = $('#option-1').val();
    var option2 = $('#option-2').val();

    //Checks to see if either of poll title or creator email is empty and unhides the respective alert
    if (!title) {
      $('.alert-danger').slideDown().append('<p>Poll must have a title!</p>');
    } else if (!email) {
      $('.alert-danger').slideDown().append('<p>Please include your email!</p>');
    } else if (!option1 || !option2) {
      $('.alert-danger').slideDown().append('<p>Poll must have at least two choices!</p>');
    } else {
      //Displays the buttons that take the user to the associated pages for their newly created poll and hides the form
      $('.buttons').slideDown();
      $('.form').slideUp();

      //Serializes the inputted data so it can be sent to the server via a POST request with ajax
      var dataString = $('#new-poll').serialize();
      //Makes an asynchrous POST request to / with the serialized data
      $.ajax({
        url: '/',
        method: 'POST',
        data: dataString,
        //Upon POST request success the server sends back a response with the newly created polls routePath which the client
        //can now use to redirect the user to the right pages for their poll
        success: function(data){
          //Parses the JSON sent by the server that holds the poll's specific routePath and inserts it into the variable defined
          //at the top of the second outermost block. This lets us use it to below for the redirect.
          routePathUrl = JSON.parse(data);
        }
      });

      //Redirects the user to the page to vote on their poll
      $('#vote').on('click', function(event) {
        event.stopPropagation();
        window.location.replace(`http://localhost:8080/${routePathUrl.pollRoutePath}`);
      });
      //Redirects the user to the page to view the results for thie poll
      $('#results').on('click', function(event) {
        event.stopPropagation();
        window.location.replace(`http://localhost:8080/${routePathUrl.pollRoutePath}/results`);
      });
    }
  });
});
