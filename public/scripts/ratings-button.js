$(() => {
  $('#options-submit').on('click', event => {
    event.preventDefault();

    let $options = $('.options').children().find('h3');
    let dataObj = makeDataObject($options);
    let idPath = window.location.href;
    let resultsPath = `${idPath}` + "/results";
    $.ajax({
      url: '/:id',
      method: 'POST',
      data: dataObj,
      success: () => {
        // hide form and show thank you
        $('.results-form').slideUp('slow', function(){
          $('.form-cont').append('<div class="alert alert-success thank-you">Thank you for your submission</div>');
          $('.form-cont').append('<a href="" id="results-btn" class="results-page-button btn btn-primary btn-default">Click here to view poll results</a>');
          $('#results-btn').attr("href", `${resultsPath}`);
        });
      }
    });
  });

});

function makeDataObject(options) {
  let obj = {}
  for (let title in options) {
    let rank = Number(title) + 1;
    if (rank) {
      let key = options[title].innerHTML;
      obj[key] = options.length - rank + 1;
    }
  }
  return obj;
}
