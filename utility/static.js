exports.registerUserError = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "Could not register a user";
    return responseResult;
}

exports.errorUserExists = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "User already exists with this email id.";
    return responseResult;
}

exports.successRegisterResponse = (data) => {
    var responseResult = {};
    responseResult.success = true;
    responseResult.data = data;
    responseResult.message = "User created successfully.";
    return responseResult;
}

exports.invalidRequest = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "Invalid Request";
    return responseResult;
}

exports.loginFailed = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "Incorrect password or email id ! login failed.";
    return responseResult;
}

exports.loginSuccess = (token) => {
    var responseResult = {};
    responseResult.success = true;
    responseResult.token = token;
    responseResult.message = "logged in successfully.";
    return responseResult;
}

exports.forgotPasswordError = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "couldn't find email to send reset password link";
    return responseResult;
}

exports.forgotPasswordSuccess = () => {
    var responseResult = {};
    responseResult.success = true;
    responseResult.message = "A reset password link has been sent to your email successfully";
    return responseResult;
}

exports.resetPasswordError = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "couldn't update password";
    return responseResult;
}

exports.resetPasswordSuccess = () => {
    var responseResult = {};
    responseResult.success = true;
    responseResult.message = "Password updated successfully";
    return responseResult;
}

exports.emailVerifyError = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "couldn't verify email";
    return responseResult;
}

exports.emailVerifySuccess = () => {
    var responseResult = {};
    responseResult.success = true;
    responseResult.message = "Your email address has been verified successfully.";
    return responseResult;
}

exports.createNoteError = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "Could not create a note";
    return responseResult;
}

exports.createNoteSuccess = (data) => {
    var responseResult = {};
    responseResult.success = true;
    responseResult.data = data;
    responseResult.message = "Note created successfully.";
    return responseResult;
}

exports.findNoteError = () => {
    var responseResult = {};
    responseResult.success = false;
    responseResult.message = "Could not find notes";
    return responseResult;
}

exports.findNoteSuccess = (data) => {
    var responseResult = {};
    responseResult.success = true;
    responseResult.data = data;
    responseResult.message = "Notes found successfully.";
    return responseResult;
}