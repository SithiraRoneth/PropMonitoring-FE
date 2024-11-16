let isValidEmail = false;
let isValidPassword = false;

function checkValidLogin(){
    isValidEmail = isValid(regexEmail, emailField.val());
    isValidPassword = isValid(regexPassword, passwordField.val());
    

    return isValidEmail && isValidPassword ;
}

let emailField = $('#txtemail');
let passwordField = $('#txtpassword');

let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let regexPassword = /^[A-Za-z0-9@#$%^&+=!]{8,}$/;

let invaliEmail = $('#invalidEmail');
let invalidPassword = $('#invalidPassword');

loginHideErrorMessages();

function loginHideErrorMessages(){
    invaliEmail.hide();
    invalidPassword.hide();
}
emailField.on('keyup',function(){
    isValidEmail = isValid(regexEmail, emailField.val());
    MakeChanges(isValidEmail, emailField, invaliEmail);
});
passwordField.on('keyup', function(){
    isValidPassword = isValid(regexPassword, passwordField.val());
    MakeChanges(isValidPassword, passwordField, invalidPassword);
});

$('#txtemail', '#txtpassword').keydown(function(e){
    if(key == "Tab"){
        e.preventDefault();
    }
});

$('#txtemail').keydown(function(e){
    if(e.key == "Enter"){
        $('#txtpassword').focus();
    }
});