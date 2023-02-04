/* namespace for validating the form and showing the errors.*/
var FormValidator = (function () {

    let publicData = {};
    let errorList = [];


    /*function to validate the city and coordinates.
    Arguments: none.
    Returns: none.
     */
    publicData.validateForm = function () {
        let cityName = document.getElementById("city-name").value;
        let lon = document.getElementById("longitude").value;
        let lat = document.getElementById("latitude").value;
        let city = new cityValidator.City(cityName, lon, lat);

        const x1 = cityNameIsValid(cityName);
        const x2 = lonIsValid(lon);
        const x3 = latIsValid(lat);

        if (x1 && x2 && x3) {
            addCityToDB(city)
            cityValidator.addCity(city);
            cityValidator.addToList(city);
            document.querySelector('form').reset();
        } else {
            document.getElementById('error-body').innerHTML = buildErrorList();
            $("#errors-modal").modal("show");
            errorList = [];
        }
    }


    /* validating city label
    Arguments: name - a string to validate
    Returns: true if valid, false otherwise.
     */
    let cityNameIsValid = function (name) {
        if (!/^[a-z]+$/i.test(name)) { // checking if cityName includes any numbers.
            errorList.push("City name must include letters only.");
            return false;
        } else if (name.trim() === '') {
            errorList.push("City name is missing.");
            return false;
        }
        return true;
    }


    /* validating the longitude
    Arguments: lon - a flaot that represents a longitude
    Returns: true if valid, false otherwise.
     */
    let lonIsValid = function (lon) {
        if (lon >= 180 || lon <= -180) {
            errorList.push("longitude must be in range [-180, 180]")
            return false;
        } else if (lon.trim() === '') {
            errorList.push("longitude is missing.");
            return false;
        } else if (!(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/).test(lon.trim())) {
            errorList.push("longitude can't contain chars");
            return false;
        } else if (!(lon % 1 !== 0)) {
            errorList.push("longitude must be float");
            return false;
        }
        return true;
    }


    /* validating the latitude
    Arguments: lat - a flaot that represents a latitude
    Returns: true if valid, false otherwise.
     */
    let latIsValid = function (lat) {
        if (lat >= 90 || lat <= -90) {
            errorList.push("latitude must be in range [-90, 90]")
            return false;
        } else if (lat.trim() === '') {
            errorList.push("Latitude is missing.");
            return false;
        } else if (!(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/).test(lat.trim())) {
            errorList.push("latitude can't contain chars");
            return false;
        } else if (!(lat % 1 !== 0)) {
            errorList.push("latitude must be float");
            return false;
        }
        return true;
    }


    /* building the errors list to show on page
    Arguments: none.
    Returns: a string with the error, an empty string if no errors.
     */
    let buildErrorList = function () {
        let res = ''
        errorList.forEach(e => {
            res += `<p>${e}</p>`;
        })
        return res;
    }
    return publicData;

})();
