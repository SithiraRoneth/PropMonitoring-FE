let login = document.getElementById('login-name')
let signup = document.getElementById('signup-name')

login.style.display = 'block'
signup.style.display = 'none'

function showSignup() {
            document.getElementById("loginDiv").style.display = "none";
            document.getElementById("signupDiv").style.display = "block";
            signup.style.display='block'
            login.style.display='none'
}
    
function showLogin() {
            document.getElementById("signupDiv").style.display = "none";
            document.getElementById("loginDiv").style.display = "block";
            login.style.display='block'
            signup.style.display='none'
}
$('#loginbtn').click(function() {
     window.location.href="index.html";
    // document.getElementById('section-login').style.display = 'none'
    // document.getElementById('dashboard-section').style.display = 'block' 
});

$('#btnSignup').click(function(){
    let email = $("#signup-email").val();
    let pw = $("#signup-password").val();
    let role = $("#signup-role").val();

    console.log(email,pw,role)
})