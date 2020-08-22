// Variables for our two chained API calls (set to an example until we figureout how we want to format inputs)

var userCity = "Chicago"

var userState = "Illinois"


// API calls to gather cloud cover, moonrise, moonset, sunrise, sunset

getOpenWeatherURL();
function getOpenWeatherURL(){
    var openWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "," + userState + "&appid=a45736dce96af4ff411de1c549396bc3"

    $.ajax({
        url: openWeatherURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var currentCityLat = response.city.coord.lat
        var currentCityLong = response.city.coord.lon
        var targetDateIndex = 0
        
        var currentCityCloud = response.list[targetDateIndex].clouds.all

        var currentCityHigh = response.list[targetDateIndex].main.temp_min;
        var currentCityLow = response.list[targetDateIndex].main.temp_max;
        var currentCityHighF = (((currentCityHigh-273.15)*1.8)+32).toFixed(0);
        var currentCityLowF = (((currentCityLow-273.15)*1.8)+32).toFixed(0);


        $("#weather").append("   High of " + currentCityHighF + "℉  &  Low of " + currentCityLowF + "℉")

        $("#cloudCover").append("   " + currentCityCloud)

        getAstronomyApi();

        function getAstronomyApi(){
            var astronomyApiURL = "https://api.ipgeolocation.io/astronomy?apiKey=79db4abf6eac4f4099b21fe90a3ff23e&lat=" + currentCityLat + "&long=" + currentCityLong

            console.log(astronomyApiURL)

            $.ajax({
                url: astronomyApiURL,
                method: "GET"
            }).then(function(response){
                $("#moonrise").append("   " + response.moonrise);
                $("#moonset").append("   " + response.moonset);
                $("#sunrise").append("   " + response.sunrise);
                $("#sunset").append("   " + response.sunset);
                console.log(response);
            })
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
moonPhaseCall(configMoon, moonHTML);




