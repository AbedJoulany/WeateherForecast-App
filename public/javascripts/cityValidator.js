/* namespace for controlling the cities info.*/
var cityValidator = (function () {

    let publicData = {};
    let cityList = [];
    const weatherDes = [
        {weather: "clear", meaning: "Total cloud cover less than 20%"},
        {weather: "cloudy", meaning: "Total cloud cover between 60%-80%"},
        {weather: "mcloudy", meaning: "Total cloud cover over 80%"},
        {weather: "pcloudy", meaning: "Total cloud cover between 20%-60%"},
        {weather: "rain", meaning: "Precipitation rate over 4mm/hr"},
        {weather: "humid", meaning: "Relative humidity over 90% with total cloud cover less than 60%"},
        {weather: "lightrain", meaning: "Precipitation rate less than 4mm/hr with cloud cover more than 80%"},
        {weather: "ishower", meaning: "Precipitation rate less than 4mm/hr less than 60%"},
        {weather: "oshower", meaning: "Precipitation rate less than 4mm/hr with cloud cover between 60%-80%"},
        {weather: "lightsnow", meaning: "Precipitation rate over 4mm/hr"},
        {weather: "snow", meaning: "Precipitation rate over 4mm/hr"},
        {weather: "rainsnow", meaning: "Precipitation type to be ice pellets or freezing rain"},
        {weather: "ts", meaning: "Lifted Index less than -5 with precipitation rate below 4mm/hr"},
        {weather: "tsrain", meaning: "Lifted Index less than -5 with precipitation rate over 4mm/hr"}
    ];
    const windDes = ["",
        "Calm",
        "0.3-3.4m/s (light)",
        "3.4-8.0m/s (moderate)",
        "8.0-10.8m/s (fresh)",
        "Below 0.3m/s (calm)",
        "17.2-24.5m/s (gale)",
        "24.5-32.6m/s (storm)",
        "Over 32.6m/s (hurricane)"];

    // function to add city in data struct.
    publicData.addCity = function (city) {
        cityList.push(city);
    }
    // function to add city in the html list
    publicData.addToList = function (c) {
        let list_item = `<option>${c.getCityName()}</option>`
        document.getElementById("cities-list").innerHTML += (list_item);
    };
    // add cities from the data base
    publicData.addCitiesFromDB = function (obj) {
        for (i of obj) {
            let city = new cityValidator.City(i.name, i.longitude, i.latitude);
            cityValidator.addCity(city);
            cityValidator.addToList(city);
        }
    }

    // removing city from list
    publicData.removeFromList = function () {
        let x = document.querySelector('.custom-select');
        if (x.selectedIndex === 0)
            return;
        removeFromDB(cityList[x.selectedIndex - 1])
        delete cityList[x.selectedIndex - 1];
        x.remove(x.selectedIndex);
    }
    // clears the cities list
    publicData.clearCitiesList = function () {
        clearListFromDB();
        cityList = [];
        document.getElementById("cities-list").innerHTML = '<option selected>Chose a city</option>';

    }
    // building the picture url of the 3 days weather forecast
    publicData.BuildCity3DaysForecast = function (str) {
        let url = '';
        cityList.forEach(city => {
            if (str === city.getCityName()) {
                url = city.get3DaysForecast();
            }
        })
        return url;
    }
    //building the picture url of the 6 days weather forecast
    publicData.BuildCityPic7DaysForecast = function (str) {
        let url = '';
        cityList.forEach(city => {
            if (str === city.getCityName()) {
                url = city.getPic7DaysForecast();
            }
        })
        return url;
    }
    // building the url of the 7 days weather forecast.
    publicData.BuildCity7DaysForecast = function (str) {
        let url = ''
        cityList.forEach(city => {
            if (str === city.getCityName()) {
                url = city.get7DaysForecast();
            }
        })
        return url;
    }
    // building the table to show 7 days weather forecast
    publicData.buildCitySevenDaysWeather = function (obj) {
        let res = `<table class="table table-hover table-responsive-sm table-secondary"><tr>
        <th scope="col">Date</th>
        <th scope="col">Temp (Min - Max)</th>
        <th scope="col">Wind</th>
        <th scope="col">Weather description</th>
        </tr>`;
        for (i of obj.dataseries) {
            let mean = '';
            weatherDes.forEach(w => {
                if (w.weather === i.weather)
                    mean = w.meaning;
            })
            let date = i.date.toString();
            date = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8);
            res += `<tr><th scope="row">${date}</th>
            <td>${i.temp2m.min} - ${i.temp2m.max}</td>
            <td>${windDes[i.wind10m_max]}</td>
            <td>${mean}</td>\</tr>`
        }
        res += `</table>`
        return res;
    }

    // class that contains a city name and its coordinates
    publicData.City = (function () {
        let acity = function (cityName, longitude, latitude) {
            this.cityName = cityName;
            this.longitude = longitude;
            this.latitude = latitude;

            acity.prototype.getCityName = function () {
                return this.cityName;
            }
            acity.prototype.getLatitude = function () {
                return this.latitude;
            }
            acity.prototype.getLongitude = function () {
                return this.longitude;
            }
            acity.prototype.get3DaysForecast = function () {
                return `http://www.7timer.info/bin/astro.php?lon=${this.longitude}&lat=${this.latitude}&ac=0&lang=en&unit=metric&output=internal&tzshift=0`;
            }
            acity.prototype.get7DaysForecast = function () {
                return `http://www.7timer.info/bin/api.pl?lon=${this.longitude}&lat=${this.latitude}&product=civillight&output=json`;
            }
            acity.prototype.getPic7DaysForecast = function () {
                return `http://www.7timer.info/bin/civillight.php?lon=${this.longitude}&lat=${this.latitude}&lang=en&ac=0&unit=metric&output=internal&tzshift=0`;
            }
        }
        return acity;
    })();


    return publicData;
})();


/* gets the picture of 7 days weather
    Arguments: event - click
    Returns: None */
function get7DaysPic(event) {

    document.getElementById("7-days-pic").innerHTML =
        `<img class="img-fluid rounded mx-auto d-block " src="../images/loading.gif">`;

    let index = document.querySelector('.custom-select').selectedIndex;
    let option = document.querySelector('.custom-select').options;
    const url = cityValidator.BuildCityPic7DaysForecast(option[index].text);

    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            if (blob.type !== "image/png")
                throw "failed to get image";
            document.getElementById("7-days-pic").innerHTML =
                `<img class="img-fluid rounded mx-auto d-block " src="${URL.createObjectURL(blob)}">`
        })
        .catch(function (err) {
            document.getElementById("7-days-pic").innerHTML =
                `<img class="img-fluid rounded mx-auto d-block " src="../images/7DaysDefault.png">`
        })
}

/* gets the picture of 3 days weather
    Arguments: event - click
    Returns: None */
function get3DaysPic(event) {

    document.getElementById("3-days").innerHTML =
        `<img class="img-fluid rounded mx-auto d-block " src="../images/loading.gif">`;

    let index = document.querySelector('.custom-select').selectedIndex;
    let option = document.querySelector('.custom-select').options;
    const url = cityValidator.BuildCity3DaysForecast(option[index].text);

    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            if (blob.type !== "image/png")
                throw "failed to get image";
            document.getElementById("3-days").innerHTML =
                `<img class="img-fluid rounded mx-auto d-block " src="${URL.createObjectURL(blob)}">`
        })
        .catch(function (err) {
            document.getElementById("3-days").innerHTML =
                `<img class="img-fluid rounded mx-auto d-block " src="../images/3DaysDefault.png">`
        })
}


/* gets a 7 days weather forcast and the data tp the table.
    Arguments: event - click
    Returns: None */
function get7DaysForecast(event) {

    document.getElementById("7-days-table").innerHTML =
        `<img class="img-fluid rounded mx-auto d-block " src="../images/loading.gif">`;

    let index = document.querySelector('.custom-select').selectedIndex;
    let option = document.querySelector('.custom-select').options;
    const url = cityValidator.BuildCity7DaysForecast(option[index].text);
    fetch(url)
        .then(res => res.json())
        .then(json => {
                document.getElementById("7-days-table").innerHTML = cityValidator.buildCitySevenDaysWeather(json);
            }
        )
        .catch(function (err) {
            document.getElementById("7-days-table").innerHTML =
                `<div class='alert alert-danger'><strong>There was a problem displaying the weather forecast: Weather forecast isn't available at the mean time.</strong></div>`
        })
}
