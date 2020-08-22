$(document).ready(function () {
    console.log("test");
    getNasaImg()

//function to get the NASA Image of the day
function getNasaImg(){
var queryURL = "https:api.nasa.gov/planetary/apod?hd=true&api_key=jdk7SmRbb6bkLwpaMmmzVERUgoNcZwqumtNpdzch";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);

    $("#nasa-title").text(response.title);
    $("#nasa-explanation").text(response.explanation);
    $("#nasa-iotd").attr("src", response.url);
})
}

//datepicker
$("#date").datepicker({
    altFormat: "@",
    altField: "#unixDate"
});

//unix timestamp is saved as an altFormat to a hidden altField
var altFormat = $("#date").datepicker("option", "altFormat");
var altField = $("#unixDate").datepicker("option", "altField");

$("#date").datepicker("option", "altFormat", "@");
$("#unixDate").datepicker("option", "altField", "#unixDate");

//value to get the unix timestamp $("#unixDate").val();





})