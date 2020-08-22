console.log("test");

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

getNasaImg()