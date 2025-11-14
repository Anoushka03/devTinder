const validator = require("validator");

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password} = req;

    if(!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
}

const assignData = (req) => {
    Object.keys(req.body).every(key => req.user[key] = req.body[key]);
}

module.exports = {validateSignupData, assignData};