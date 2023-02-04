/* namespace for validating the password form and showing the errors */
var passwordValidator = (function () {

    let publicData = {};
    let errorList = [];

    publicData.validateForm = function (event) {

        let password1 = document.getElementById('password').value;
        let password2 = document.getElementById('password-repeat').value;

        if (!(passwordValidator(password1) && identicalPassword(password1, password2))) {
            document.getElementById('error-body').innerHTML = buildErrorList();
            $("#errors-modal").modal("show");
            errorList = [];
            return;
        }
        serverValidator(password1);
    }

    /* validas the given fields with the server database
    * Arguments: pass - string that represents the password
    * Return: res.text() if vallid.
    * */
    let serverValidator = function (pass) {
        let data = {password: pass}
        fetch('/login', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => {
            if (res.status !== 200)
                throw 'Register failed, you should choose password in 1 min';
            return res.text()
        }).then(text => {
            showError('register successful!', `${text}, redirecting to login page in few sec.`)
            setTimeout("pageRedirect('http://localhost:3000/login')", 3000);
        }).catch(error => {
            showError('cookies expierd!', `${error}, redirecting to register page in few sec.`)
            setTimeout("pageRedirect('http://localhost:3000/register')", 3000);
        });
    }

    /* validates password lenghth
    * Arguments: password
    * Return: true if valid, false otherwise.*/
    let passwordValidator = function (pass) {
        if (pass.trim() === '' || pass.length < 8) {
            errorList.push("password should be at least 8 characters.");
            return false;
        }
        return true;
    }

    /* validates passwords match
    * Arguments: password
    * Return: true if valid, false otherwise.*/
    let identicalPassword = function (pass1, pass2) {
        if (pass1 !== pass2) {
            errorList.push("passwords doesn't match!")
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
