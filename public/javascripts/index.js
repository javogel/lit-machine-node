
$(function() {

  $( "#invoke" ).click(function() {
    author = $('#author-select').val()
    $.ajax({
      type: "GET",
      url: "/get-lines/" + author,
      success: function(data){
         $("#text").append($("<h2></h2>").text(data));
      }
      });
  });

});
