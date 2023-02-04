/* adde the given city data to the data base
    Arguments: city - JSON data that represents the city to add.
    Returns: None */
function addCityToDB(city) {

    const data = {
        name: city.getCityName(),
        longitude: city.getLongitude(),
        latitude: city.getLatitude()
    }
    fetch('/api/weatherForecast/cities', {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => res.json())
        .then(json => {
        }).catch(error => {
        showError('Session TimeOut!',`couldn't add city ( Session TimeOut. ), redirecting to login page in few sec.`)
        setTimeout("pageRedirect('http://localhost:3000/login')", 3000);
    })

}


/* removes the given city data from the data base
    Arguments: city - JSON data that represents the city to remove.
    Returns: None */
function removeFromDB(city) {

    fetch('/api/weatherForecast/cities/' + city.getCityName() + '/' + city.getLongitude() + '/' + city.getLatitude(), {
        method: "delete",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json())
        .then(json => {
            console.log(json.url, `deleted from server`);
        }).catch(error => {

        showError('Session TimeOut!',`couldn't delete city ( Session TimeOut. ), 
        redirecting to login page in few sec.`)
        setTimeout("pageRedirect('http://localhost:3000/login')", 3000);
    })
}


/* gets the city list of the currrent user from the data base
    Arguments: None
    Returns: None */
function getCityListFromDB() {

    fetch('/api/weatherForecast/cities')
        .then(res => res.json())
        .then(json => {
            cityValidator.addCitiesFromDB(json);
        })
        .catch(error => {
            showError('Session TimeOut!',`couldn't get citiesList ( Session TimeOut. ),
             redirecting to login page in few sec.`)
            setTimeout("pageRedirect('http://localhost:3000/login')", 3000);
        })
}


/* removes all the cities for the current user from the data base
    Arguments: None
    Returns: None */
function clearListFromDB() {

    fetch('/api/weatherForecast/cities', {
        method: "delete",
    }).then(res => res.json())
        .then(json => {
            console.log(json.url, `deleted from server`);
        }).catch(error => {
        showError('Session TimeOut!',`couldn't delete citiesList ( Session TimeOut. ), redirecting to login page in few sec.`)
        setTimeout("pageRedirect('http://localhost:3000/login')", 3000);
    })
}


/* redirect the page to the new location from the clint side.
    Arguments: location - the location to be directed to.
    Returns: None */
function pageRedirect(location) {
    window.location.href = location;
}


/* pops up the error message window.
    Arguments: title - the error title, error - the error content.
    Returns: None */
function showError(title,error) {
    document.getElementsByClassName('modal-title').item(0).innerHTML = title;
    document.getElementById('error-body').innerHTML = `<h2>${error}</h2>`;
    $("#errors-modal").modal("show");
}