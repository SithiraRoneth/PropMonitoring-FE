let isValidName = false;
let isValidScientific = false
let isValidCategory = false
let isValidSeason = false

function checkValidCrop(){
    isValidName = isValid(regexName, nameField.val());
    isValidScientific = isValid(regexScientific, scientificField.val());
    isValidCategory = isValid(regexCategory, categoryField.val());
    isValidSeason = isValid(regexSeason, seasonField.val());

    return isValidName && isValidScientific && isValidCategory && isValidSeason;
}

// text field
let nameField = $('#txtcropname');
let scientificField = $('#txtscientific');
let categoryField = $('#txtcategory');
let seasonField = $('#txtseason');

// regex pattern
let regexName = /^[A-Za-z ]{4,}$/;
let regexScientific = /^[A-Za-z ]{4,}$/;
let regexCategory = /^[A-Za-z ]{4,}$/;
let regexSeason = /^[0-9]{1,}$/;

// error label
let invalidName = $('#invalidName');
let invalidScientific = $('#invalidScientific');
let invalidCategory = $('#invalidCateogry');
let invalidSeason = $('#invalidSeason');

cropFormHideErrorMessages()

function cropFormHideErrorMessages(){
    invalidName.hide();
    invalidScientific.hide();
    invalidCategory.hide();
    invalidSeason.hide();
}

nameField.on('keyup', function(){
    isValidName = isValid(regexName, nameField.val());
    MakeChanges(isValidName, nameField, invalidName);
});
scientificField.on('keyup', function(){
    isValidScientific = isValid(regexScientific, scientificField.val());
    MakeChanges(isValidScientific, scientificField, invalidScientific);
});
categoryField.on('keyup', function(){
    isValidCategory = isValid(regexCategory, categoryField.val());
    MakeChanges(isValidCategory, categoryField, invalidCategory);
});
seasonField.on('keyup', function(){
    isValidSeason = isValid(regexSeason, seasonField.val());
    MakeChanges(isValidSeason, seasonField, invalidSeason);
});

// disable tab
$('#txtcropname','#txtscientific','#txtcategory','#txtseason').keydown(function(e){
    if(e.key == "Tab"){
        e.preventDefault();
    }
});

$('#txtcropname').keydown(function(e){
    if(e.key == "Enter"){
        $('#txtscientific').focus();
    }
});
$('#txtscientific').keydown(function(e){
    if(e.key == "Enter"){
        $('#txtcategory').focus();
    }
});
$('#txtcategory').keydown(function(e){
    if(e.key == "Enter"){
        $('#txtseason').focus();
    }
});