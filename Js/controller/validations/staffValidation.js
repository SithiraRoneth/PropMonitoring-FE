let isstaffName = false
let isEmail = false
let isAddress = false
let isContact = false
let isLastName = false

function checkValidStaff(){
    isstaffName = isValid(regexName, staffnameField.val());
    isEmail = isValid(regexEmail, emailField.val())
    isAddress = isValid(regexAddress, addressField.val())
    isContact = isValid(regexContact, contactField.val())
    isLastName = isValid(regexLast, lastName.val())

    return isstaffName && isEmail && isAddress && isContact && isLastName;
}

let staffnameField = $('#txtfirstname')
let emailField = $('#txtemail')
let addressField =$('#txtaddress')
let contactField =  $('#txtcontact')
let lastName = $('#txtlastname')

let regexStaffName = /^[A-Za-z ]{4,}$/;
let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let regexAddress = /^[A-Za-z ]{4,}$/;
let regexContact = /^[0-9]{10}$/
let regexLast = /^[A-Za-z ]{4,}$/;

let invalidStaffName = $("#invalidStaffName")
let invalidEmail = $("#invalidEmail")
let invalidAddress = $("#invalidAddress")
let invalidContact = $("#invalidContact")
let invaliLast = $("#invalidLast")

staffFormHideErrorMessages()

function staffFormHideErrorMessages(){
    invalidStaffName.hide()
    invalidEmail.hide()
    invalidAddress.hide()
    invalidContact.hide()
    invaliLast.hide()
}
staffnameField.on('keyup',function(){
    isstaffName = isValid(regexStaffName, staffnameField.val())
    MakeChanges(isstaffName,staffnameField,invalidStaffName)
})
emailField.on('keyup',function(){
    isEmail = isValid(regexEmail, emailField.val())
    MakeChanges(isEmail,emailField,invalidEmail)
})
addressField.on('keyup',function(){
    isAddress = isValid(regexAddress, addressField.val())
    MakeChanges(isAddress,addressField,invalidAddress)
})
contactField.on('keyup',function(){
    isContact = isValid(regexContact, contactField.val())
    MakeChanges(isContact,contactField,invalidContact)
})
lastName.on('keyup',function(){
    isLastName = isValid(regexLast, lastName.val())
    MakeChanges(isLastName,lastName,invaliLast)
})
