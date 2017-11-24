$(() => {
  $("#options-submit").on("click", event => {
    event.preventDefault();

    let $options = $(".options").children();

    let titlesObj = makeTitlesArray($options);
    // console.log(titlesObj);
    $.ajax({
      url: '/:id',
      method: 'POST',
      data: titlesObj,
      success: () => {
        console.log("Success!");
        $('.results-form').slideUp('slow', function(){
          $('.form-cont').append('<div class="alert alert-success thank-you">Thank you for your submission</div>');
        });
      }
    });
  });

});

function makeTitlesArray(options) {
  let titles = options.find("h3");
  let obj = {}
  for (let title in titles) {
    let rank = Number(title) + 1;
    if (rank) {
      // console.log(titles[title].innerHTML, "Rank:", rank);
      // titlesArray.push(titles[title].innerHTML);
      obj[titles[title].innerHTML] = titles.length - rank + 1;
    }
  }
  return obj;
}
