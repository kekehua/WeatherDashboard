let APIkey = "9fed56c63d48caf6d924f040bbcd31fc";

var city = document.getElementById("city");
var button = document.getElementById("button");

var currentCity;

const Formsubmit =  function(){
    var currentCity = document.getElementById("city").value;
    console.log(currentCity);
    // Coordinates(currentCity);
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+currentCity+"&appid="+APIkey;
    fetch(requestUrl)
    .then(function(response) {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    })
    .then(function(data){
        console.log(data);
        console.log(data.coord.lat);
    var requestUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&exclude=minutely,hourly,alerts&units=metric&appid="+APIkey;
    fetch(requestUrl2)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            var currentConditionsEl = document.getElementById("currentConditions");
            currentConditionsEl.classList.add("border");
            currentConditionsEl.classList.add("border-primary");

            var cityNameEl = document.createElement("h2");
            const currentCityE1 = document.createTextNode(currentCity);
            cityNameEl.append(currentCityE1)
            currentConditionsEl.append(cityNameEl);

            var currentCityDate = data.current.dt;
            const milliseconds = currentCityDate*1000;
            currentCityDate = new Date(milliseconds);
            const currentDate = document.createTextNode(currentCityDate);
            cityNameEl.append(currentDate);


            var currentCityWeatherIcon = data.current.weather[0].icon; 
            var currentWeatherIconEl = document.createElement("img");
            currentWeatherIconEl.src = "http://openweathermap.org/img/wn/" + currentCityWeatherIcon + ".png";
            cityNameEl.append(currentWeatherIconEl);

            var currentCityTemp = data.current.temp;
            var currentTempEl = document.createElement("p");
            currentTempEl = currentCityTemp+ " Celcius  ";
            currentConditionsEl.append(currentTempEl);

            var currentCityWind = data.current.wind_speed;
            var currentWindEl = document.createElement("p");
            currentWindEl = currentCityWind + " meters/s  ";
            currentConditionsEl.append(currentWindEl);

            var currentCityHumidity = data.current.humidity;
            var currentHumidityEl = document.createElement("p");
            currentHumidityEl = currentCityHumidity + "%  "
            currentConditionsEl.append(currentHumidityEl);

            var currentCityUV = data.current.uvi;
            var currentUvEl = document.createElement("p");
            var currentUvSpanEl = document.createElement("span");
            currentUvEl.append(currentUvSpanEl);

            currentUvEl= "UV: " + currentCityUV;

            if (currentCityUV < 3) {
                currentUvSpanEl.style.background.color= "green";
                currentUvSpanEl.style.color="white";
            } else if (currentCityUV < 6) {
                currentUvSpanEl.style.background.color= "yellow";
                currentUvSpanEl.style.color="black";
            } else if (currentCityUV < 8) {
                currentUvSpanEl.style.background.color= "orange";
                currentUvSpanEl.style.color="white";
            } else if (currentCityUV < 11) {
                currentUvSpanEl.style.background.color= "red";
                currentUvSpanEl.style.color="white";
            } else {
                currentUvSpanEl.style.background.color= "violet";
                currentUvSpanEl.style.color="white";
            }

            currentConditionsEl.append(currentUvEl);

            var fiveDayForecastHeaderEl = document.getElementById("fivedayForecastHeader");
            var fiveDayHeaderEl = document.createElement("h2");
            // fiveDayHeaderEl.createTextNode("5-Day Forecast:");
            fiveDayForecastHeaderEl.append("5-Day Forecast");

            var fiveDayForecastEl = document.getElementById("forecast");

            for (var i = 1; i <= 5; i++) {
                var date;
                var temp;
                var icon;
                var wind;
                var humidity;

                date = data.daily[i].dt;
                const milliseconds = date*1000;
                date = new Date(milliseconds);

                temp = data.daily[i].temp.day+"Degrees Celcius";
                icon = data.daily[i].weather[0].icon;
                wind = data.daily[i].wind_speed+"Meters/s";
                humidity = data.daily[i].humidity+"% Humidity";
                
                var card = document.createElement("div");
                card.classList.add("card", "col-2", "m-1", "bg-primary", "text-white");
                
                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.append(
                                date,
                                temp,
                                wind,
                                humidity)

                card.appendChild(cardBody);
                fiveDayForecastEl.append(card);
            }
        });
    })
}


button.addEventListener("click",Formsubmit);