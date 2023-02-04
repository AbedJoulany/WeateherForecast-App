/* namespace for validating the login form and showing the errors*/
var loginValidator = (function () {

    let publicData = {};
    let errorList = [];

    //validates the form
    publicData.validateForm = function (event) {
        let email = document.getElementById("Email").value;
        let password = document.getElementById("Password").value;

        const x1 = emailValidator(email);
        const x2 = passwordValidator(password);

        if (!(x1 && x2)) {
            event.preventDefault();
            document.getElementById('error-body').innerHTML = buildErrorList();
            $("#errors-modal").modal("show");
            errorList = [];
            return;
        }
    }

    /* validas the given fields witht the server data base
    * Arguments: email - string, password - stirng
    * Return: res.text() if vallid.
    * */
    let serverValidator = function (email, password) {
        let data = {Email: email, Password: password}
        fetch('/weatherForecast', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => {
            if (res.status !== 200)
                throw `login failed, password isn't correct`;
            return res.text()
        }).then(text => {
        }).catch(error => {
            showError('login failed!', `${error},try again`)
            document.querySelector('form').reset();
        });
    }

    // calls the validator with the email argument
    let emailValidator = function (name) {
        return nameValidator(name, "email")
    }

    // calls the validator with the password argument
    let passwordValidator = function (name) {
        return nameValidator(name, "password")
    }

    /* valid field not empty.
    * Arguments: name - string to validate, error - filed name to add to error if neccessary
    * true if valid, false otherwise.
    * */
    let nameValidator = function (name, error) {
      if (name.trim() === '') {
            errorList.push(`${error} is missing.`);
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