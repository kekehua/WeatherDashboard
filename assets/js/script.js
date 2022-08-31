var APIkey = "9fed56c63d48caf6d924f040bbcd31fc";

var cityInputEl = document.getElementById("city-input");
var searchBtn = document.getElementById("search-button");
var clearBtn = document.getElementById("clear-button");
var pastSearchedCitiesEl = document.getElementById("past-searches");

var currentCity;

// use Open Weather 'One Call API' to get weather based on city coordinates
function getWeather(data) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${APIkey}`;
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var currentConditionsEl = document.getElementById("currentConditions");
            currentConditionsEl.classList.add("border");
            currentConditionsEl.classList.add("border-primary");

            var cityNameEl = document.createElement("h2");
            const currentCityE1 = document.createTextNode(currentCity);
            cityNameEl.append(currentCityE1)
            currentConditionsEl.append(cityNameEl);

            var currentCityDate = data.current.dt;
            currentCityDate = moment.unix(currentCityDate).format("MM/DD/YYYY");
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

            var fiveDayForecastHeaderEl = $("#fiveDayForecastHeader");
            var fiveDayHeaderEl = $("<h2>");
            fiveDayHeaderEl.text("5-Day Forecast:");
            fiveDayForecastHeaderEl.append(fiveDayHeaderEl);

            var fiveDayForecastEl = $("#fiveDayForecast");

            for (var i = 1; i <= 5; i++) {
                var date;
                var temp;
                var icon;
                var wind;
                var humidity;

                date = data.daily[i].dt;
                date = moment.unix(date).format("MM/DD/YYYY");

                temp = data.daily[i].temp.day;
                icon = data.daily[i].weather[0].icon;
                wind = data.daily[i].wind_speed;
                humidity = data.daily[i].humidity;

                var card = document.createElement("div");
                card.classList.add("card", "col-2", "m-1", "bg-primary", "text-white");

                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.innerHTML = `<h6>${date}</h6>
                                      <img src= "http://openweathermap.org/img/wn/${icon}.png"> </><br>
                                       ${temp}°C<br>
                                       ${wind} KPH <br>
                                       ${humidity}%`;

                card.appendChild(cardBody);
                fiveDayForecastEl.append(card);
            }
        });
    return;
}

function displaySearchHistory() {
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    var pastSearchesEl = document.getElementById("past-searches");

    pastSearchesEl.innerHTML = "";

    for (i = 0; i < storedCities.length; i++) {
        var pastCityBtn = document.createElement("button");
        pastCityBtn.classList.add("btn", "btn-primary", "my-2", "past-city");
        pastCityBtn.setAttribute("style", "width: 100%");
        pastCityBtn.textContent = `${storedCities[i].city}`;
        pastSearchesEl.appendChild(pastCityBtn);
    }
    return;
}

var getCoordinates = function(currentCity) {
    console.log(currentCity);
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+currentCity+"&appid="+APIkey;
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];

    fetch(requestUrl)
        .then(function(response) {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function(data) {
            var cityInfo = {
                city: currentCity,
                lon: data.coord.lon,
                lat: data.coord.lat,
            };

            storedCities.push(cityInfo);
            localStorage.setItem("cities", JSON.stringify(storedCities));

            displaySearchHistory();

            return cityInfo;
        })
        .then(function(data) {
            getWeather(data);
        });
    return;
}

function handleClearHistory(event) {
    event.preventDefault();
    var pastSearchesEl = document.getElementById("past-searches");

    localStorage.removeItem("cities");
    pastSearchesEl.innerHTML = "";

    return;
}

function clearCurrentCityWeather() {
    var currentConditionsEl = document.getElementById("currentConditions");
    currentConditionsEl.innerHTML = "";

    var fiveDayForecastHeaderEl = document.getElementById(
        "fiveDayForecastHeader"
    );
    fiveDayForecastHeaderEl.innerHTML = "";

    var fiveDayForecastEl = document.getElementById("fiveDayForecast");
    fiveDayForecastEl.innerHTML = "";

    return;
}

const handleCityFormSubmit = function() {
    var currentCity = document.getElementById("city-input").value;
    console.log(currentCity);
        getCoordinates(currentCity);
    
}

function getPastCity(event) {
    var element = event.target;

    if (element.matches(".past-city")) {
        currentCity = element.textContent;

        clearCurrentCityWeather();

        var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIkey}`;

        fetch(requestUrl)
            .then(function(response) {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(function(data) {
                var cityInfo = {
                    city: currentCity,
                    lon: data.coord.lon,
                    lat: data.coord.lat,
                };
                return cityInfo;
            })
            .then(function(data) {
                getWeather(data);
            });
    }
    return;
}

displaySearchHistory();

clearBtn.addEventListener("click", clearCurrentCityWeather);

searchBtn.addEventListener("click", handleCityFormSubmit);

clearBtn.addEventListener("click", handleClearHistory);

pastSearchedCitiesEl.addEventListener("click", getPastCity);