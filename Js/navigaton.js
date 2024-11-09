const sections = ['crop', 'field', 'vehicle', 'equipment', 'staff'];
    sections.forEach(section => document.getElementById(section).style.display = 'none');

    function showSection(selectedSection) {
        sections.forEach(section => {
            document.getElementById(section).style.display = section === selectedSection ? 'block' : 'none';
        });
    }

    function logout() {
        if (confirm("Are you sure you want to log out?")) {
            window.location.href = 'login-signup.html';
        }
    }