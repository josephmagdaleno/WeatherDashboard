//store the city being searched for
var city = $("#searchTerm").val();
//store the API key for weather map
var apiKey = "&appid=680131b5ef330f5e5cd50524c0bc7e48";
// set a variable to the date string
var date = new Date();

$("#searchTerm").keypress(function(event) { 
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#searchBtn").click(); 
	} 
});
//give the search button an onclick function.
$("#searchBtn").on("click", function() {

  $('#forecastH5').addClass('show');
  city = $("#searchTerm").val();
  $("#searchTerm").val(""); 
  //localStorage.setItem("weather", JSON.stringify()); 

  var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
  $.ajax({
    url: queryUrl,
    method: "GET"
  })

  .then(function (response){

    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    getRecentCondition(response);
    getCurrentWeather(response);
    makeList();

    })
  });

  function makeList() {
    var listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
  }

  function getRecentCondition (response) {

    // get the temperature and convert to fahrenheit 
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);

    $('#currentCity').empty();

    // getting the 5 day forcast appear when loaded.
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    var city = $("<h4>").addClass("card-title").text(response.name);
    var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    var wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    //append the cards to the html
    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#currentCity").append(card)
   
  }

function getCurrentWeather () {
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response){
    $('#forecast').empty();
    var results = response.list;

    for (var i = 0; i < results.length; i++) {

      var day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      var hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      console.log(day);
      console.log(hour);

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        
      
        var temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        var tempF = Math.floor(temp);

        var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        var cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        var temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
        var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

        var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);

      }
    }
   
  });

  //function loadCity (){
    //var lastCity = JSON.parse(localStorage.getItem(city));
    //$("#currentCity").val("");
    //$("#currentCity").val("");}


}