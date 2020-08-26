$(document).ready(function () {
    //Get today's date for the NASA Image of the Day
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    console.log(today);

    getNasaImg();

//function to get the NASA Image of the day
function getNasaImg(){
    var queryURL = "https:api.nasa.gov/planetary/apod?hd=true&date=" + today + "&api_key=jdk7SmRbb6bkLwpaMmmzVERUgoNcZwqumtNpdzch";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);

    $("#nasa-title").text(response.title);
    $("#nasa-explanation").text(response.explanation);
    console.log(response.media_type);
    if (response.media_type == "video") {
        console.log("true");
        var video = $("<iframe>");
        video.css({ "width": "520", "height": "415" });
        video.attr("src", response.url)
        $("#nasa-iotd").append(video);
    } else if (response.media_type == "image") {
        var img = $("<img>");
        img.attr("src", response.url)
        $("#nasa-iotd").append(img);
        $("#nasa-iotd").attr("src", response.url);
    }
})
}

//Moved the code below to the other "script.js" file


// //datepicker
// $("#date").datepicker({
//     altFormat: "@",
//     altField: "#unixDate"
// });

// //unix timestamp is saved as an altFormat to a hidden altField
// var altFormat = $("#date").datepicker("option", "altFormat");
// var altField = $("#unixDate").datepicker("option", "altField");

// $("#date").datepicker("option", "altFormat", "@");
// $("#unixDate").datepicker("option", "altField", "#unixDate");

// //value to get the unix timestamp is: $("#unixDate").val();

// //Google autocomplete for location
// var input = document.getElementById("location");
// var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
// google.maps.event.addListener(autocomplete, 'place_changed', function(){
//     //place is an object that we can extract both city and state from
//     var place = autocomplete.getPlace();
//     console.log(place);
//     console.log(place.address_components[0].long_name);
//     console.log(place.address_components[2].short_name);
//  })





})