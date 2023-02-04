/* namespace for validating the register form and showing the errors */
var registerValidator = (function () {

    let publicData = {};
    let errorList = [];

    publicData.validateForm = function (event) {
        let firstName = document.getElementById("First-name").value;
        let lastName = document.getElementById("Last-name").value;
        let emailAddress = document.getElementById("Email-address").value;

        const x1 = firstNameValidator(firstName);
        const x2 = lastNameValidator(lastName);
        const x3 = emailAddressValidator(emailAddress);

        if (!(x1 && x2 && x3)) {
            event.preventDefault();
            document.getElementById('error-body').innerHTML = buildErrorList();
            $("#errors-modal").modal("show");
            errorList = [];
        }
    }

    // calls the validator with the First name argument
    let firstNameValidator = function (name) {
        return nameValidator(name, "First name")
    }

    // calls the validator with the Last name argument
    let lastNameValidator = function (name) {
        return nameValidator(name, "Last name")
    }

    /* validates the email, if not empty and valid.
    ArgumentsL str - string that represents the email
    Return: true if valid, false otherwise.
    * */
    let emailAddressValidator = function (str) {
        if (str.trim() === '') {
            errorList.push("Email address is missing.");
            return false;
        } else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(str)) {
            errorList.push("Email address is not Valid.");
            return false;
        }
        return true;
    }

    /* valid field not empty.
    * Arguments: name - string to validate, error - filed name to add to error if neccessary
    * true if valid, false otherwise.
    * */
    let nameValidator = function (name, error) {
        // checking if Name includes any numbers.
        if (!/^[a-z]+$/i.test(name)) {
            errorList.push(`${error} must include letters only.`);
            return false;
        } else if (name.trim() === '') {
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
