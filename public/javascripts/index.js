
$(function() {

  $( "#invoke" ).click(function() {
    author = $('#author-select').val()
    $.ajax({
      type: "GET",
      url: "/get-lines/" + author,
      success: function(data){
        $("#proposed-text").html(data);
      }
      });
  });

  $( "#keep" ).click(function() {
    var text = " " + $("#proposed-text").html();
    $("#proposed-text").html("")
    $("#final-text").append(text);
  });



});
