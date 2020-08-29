$(document).ready(function () {
    // Variables for our two chained API calls (set to an example until we figureout how we want to format inputs)
    var userCity = "";
    var userState = "";

    //Get today's date for the NASA Image of the Day
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    nasaToday = yyyy + "-" + mm + "-" + dd;
    today = mm + "/" + dd + "/" + yyyy;

    getNasaImg();

    //function to get the NASA Image of the day
    function getNasaImg(){
        var queryURL = "https://api.nasa.gov/planetary/apod?hd=true&date=" + nasaToday + "&api_key=jdk7SmRbb6bkLwpaMmmzVERUgoNcZwqumtNpdzch";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        $("#nasa-title").text(response.title);
        $("#nasa-explanation").text(response.explanation);
        if (response.media_type == "video") { //if statement to display a video url
            var video = $("<iframe>");
            video.css({ "width": "520", "height": "415" });
            video.attr("src", response.url)
            $("#nasa-iotd").append(video);
        } else if (response.media_type == "image") { // else statement to display an image
            var img = $("<img>");
            img.attr("src", response.url)
            $("#nasa-iotd").append(img);
        }
    })
    }

    //datepicker
    $("#date").datepicker({
        altFormat: "@",
        altField: "#unixDate"
    });

    //datepicker: unix timestamp is saved as an altFormat to a hidden altField
    var altFormat = $("#date").datepicker("option", "altFormat");
    var altField = $("#unixDate").datepicker("option", "altField");
    $("#date").datepicker("option", "altFormat", "@");
    $("#unixDate").datepicker("option", "altField", "#unixDate");

    //value to get the unix timestamp is: $("#unixDate").val();

    //Google autocomplete for the location field
    var input = document.getElementById("location");
    var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
    google.maps.event.addListener(autocomplete, 'place_changed', function(){
        //"place" is the object that we can extract both city and state from
        var place = autocomplete.getPlace();
        // console.log(place.address_components[0].long_name); //city
        // console.log(place.address_components[2].long_name); //state
    })

    // API calls to gather cloud cover, moonrise, moonset, sunrise, sunset


    function getOpenWeatherURL(){

        var spaceStationLocURL = "http://api.open-notify.org/iss-now.json"

        $.ajax({
            url: spaceStationLocURL,
            method: "GET"
        }).then(function(response){
            console.log(response)
            $("#where-is-iss").append("   Longitude of  " + response.iss_position.longitude + "   Latitude of " + response.iss_position.latitude)

        })
        

        // initiating our chain of ajax calls that are dependant on one another

        var openWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "," + userState + "&appid=a45736dce96af4ff411de1c549396bc3&units=imperial"
        
        
        $.ajax({
            url: openWeatherURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var currentCityLat = response.coord.lat;
            var currentCityLong = response.coord.lon;

            getAstronomyApi();
            getFutureWeatherAPI();

            function getFutureWeatherAPI() {
                var futureWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentCityLat + "&lon=" + currentCityLong +"&appid=a45736dce96af4ff411de1c549396bc3&units=imperial";
                
                $.ajax({
                    url: futureWeatherURL,
                    method: "GET"
                }).then(function(response){
                    console.log(response);

                    var todaySunrise = new Date(response.daily[0].sunrise * 1000);
                    var todaySunset = new Date(response.daily[0].sunset * 1000);

                    $("#sunrise").append("   " + todaySunrise.toLocaleTimeString());
                    $("#sunset").append("   " + todaySunset.toLocaleTimeString());


                    var datePickerVal = $("#unixDate").val();
                    console.log(datePickerVal);

                    var userDate = new Date(datePickerVal*1);
                    var userDateString = userDate.toLocaleDateString();

                    for ( var i = 0 ; i < 8 ; i++ ){
                        var compValue = response.daily[i].dt;
                        var compDate = new Date(compValue*1000);
                        var compDateString = compDate.toLocaleDateString();

                        if (compDateString == userDateString) {
                            var futureHigh = response.daily[i].temp.max;
                            var futureLow = response.daily[i].temp.min;
                            var futureSunrise = new Date(response.daily[i].sunrise * 1000);
                            var futureSunset = new Date(response.daily[i].sunset * 1000);
                            var futureCloud = response.daily[i].clouds;

                            if (futureCloud < 20) {
                                $("#viewingScore").html('<i class="fas fa-circle good"></i>');
                            } else if (20 <= futureCloud && futureCloud < 50) {
                                $("#viewingScore").html('<i class="fas fa-circle fair"></i>');
                            } else if (50 <= futureCloud && futureCloud < 70) {
                                $("#viewingScore").html('<i class="fas fa-circle ok"></i>');
                            } else if (70 <= futureCloud) {
                                $("#viewingScore").html('<i class="fas fa-circle bad"></i>');
                            }

                            $("#cloudCover").append("   " + futureCloud + "%")
                            $("#weather").append("   High of " + futureHigh + "℉  &  Low of " + futureLow + "℉")
                            $("#future-sunrise").append("   " + futureSunrise.toLocaleTimeString());
                            $("#future-sunset").append("   " + futureSunset.toLocaleTimeString());
                        }
                    }
                })
            }

            function getAstronomyApi(){
                var astronomyApiURL = "https://api.ipgeolocation.io/astronomy?apiKey=79db4abf6eac4f4099b21fe90a3ff23e&lat=" + currentCityLat + "&long=" + currentCityLong

                console.log(astronomyApiURL)

                $.ajax({
                    url: astronomyApiURL,
                    method: "GET"
                }).then(function(response){

                    var moonriseHour = response.moonrise.slice(0,2);
                    var moonriseMin = response.moonrise.slice(3,5);

                    if (moonriseHour == 0) {
                        $("#moonrise").append("   12:" + moonriseMin + ":00 AM")
                     } else if ( moonriseHour > 0 && moonriseHour < 12) {
                         $("#moonrise").append("   " + moonriseHour + ":" + moonriseMin + ":00 AM")
                     } else if (moonriseHour == 12){
                         $("#moonrise").append("   " + moonriseHour + ":" + moonriseMin + ":00 PM")
                     } else if (moonriseHour > 12) {
                        var displayHour = moonriseHour - 12
                        $("#moonrise").append("   " + displayHour + ":" + moonriseMin + ":00 PM") 
                    }
                    

                    var moonsetHour = response.moonset.slice(0,2);
                    var moonsetMin = response.moonset.slice(3,5);
                    if (moonsetHour == 0) {
                        $("#moonset").append("   12:" + moonsetMin + ":00 AM")
                     } else if ( moonsetHour > 0 && moonsetHour < 12) {
                         $("#moonset").append("   " + moonsetHour + ":" + moonsetMin + ":00 AM")
                     } else if (moonsetHour == 12){
                         $("#moonset").append("   " + moonsetHour + ":" + moonsetMin + ":00 PM")
                     } else if (moonsetHour > 12) {
                        var displayHourMS = moonsetHour - 12
                        $("#moonset").append("   " + displayHourMS + ":" + moonsetMin + ":00 PM") 
                    } 
                });

            };
        })
    }    

    // moonphase method/API found at http://www.wdisseny.com/lluna/?lang=en 
    // XML call. Currently defaults to today, we can connect this to the date picker 

    function moonPhaseCall(obj,callback){
        var gets=[]
        for (var i in obj){
            gets.push(i + "=" +encodeURIComponent(obj[i]))
        }
        gets.push("LDZ=" + new Date(obj.year,obj.month-1,1) / 1000)
        var xmlhttp = new XMLHttpRequest()
        var url = "https://www.icalendar37.net/lunar/api/?" + gets.join("&")
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(JSON.parse(xmlhttp.responseText))
            }
        }
        xmlhttp.open("GET", url, true)
        xmlhttp.send()
    }

    function moonHTML(moon){    
        var day = new Date().getDate()
        var html = 
        "<div>" + moon.phase[day].svg + "</div>" +
        "<div>" + moon.phase[day].phaseName + " " +
        "" + ((moon.phase[day].isPhaseLimit)? ""  :   Math.round(moon.phase[day].lighting) + "%") +
        "</div>" + "</div>"
        document.getElementById("moonPhase").innerHTML = html
    }   
    var configMoon = {
        lang  		:'en', 
        month 		:new Date().getMonth() + 1,
        year  		:new Date().getFullYear(),
        size		:150, 
        lightColor	:"rgb(255,255,210)", 
        shadeColor	:"black", 
        texturize	:true, 
    }


    //function to clear the output fields so the values don't keep appending to the fields
    function clearOutput() {
        $("#viewingScore").text("");
        $("#weather").text("");
        $("#cloudCover").text("");
        $("#sunrise").text("");
        $("#sunset").text("");
        $("#future-sunrise").text("");
        $("#future-sunset").text("");
        $("#moonrise").text("");
        $("#moonset").text("");
        $("#moonPhase").text("");
        $("#where-is-iss").text("");
        $("#iss-passes").text("");
    }

    //click event listener to run the API calls when the user hits enter
    $("#enter").click(function(event) {
        event.preventDefault();

        //error handling for when the date value is blank
        if ($("#date").val() == "") {
            var dateError = $("<p>");
            dateError.css({"color": "red"});
            dateError.text("Please select a date");
            $("#date").parent().append(dateError);
            setTimeout(function () {
                dateError.remove();
                }, 2000);
            return;
        }

        //error handling for when the location value is blank
        if ($("#location").val() == "") {
            var locationError = $("<p>");
            locationError.css({"color": "red"});
            locationError.text("Please select a location");
            $("#location").parent().append(locationError);
            setTimeout(function () {
                locationError.remove();
                }, 2000);
            return;
        }

        var place = autocomplete.getPlace(); //gets the Google "place" object
        userCity = place.address_components[0].long_name; //city from place object
        userState= place.address_components[2].long_name; //state from place object

        clearOutput();
        getOpenWeatherURL();
        moonPhaseCall(configMoon, moonHTML);

        $("#forecast-date").text($("#date").val()); //adds the date to the output date field
        $("#today-date").text(today); //adds the date to the todays date field

        //displays the currentData and forecastData boxes
        $("#forecastData").css({"display":"block"});
        $("#currentData").css({"display":"block"});
    })


})