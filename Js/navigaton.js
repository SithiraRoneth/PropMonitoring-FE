const sections = ['profile','crop', 'field', 'vehicle', 'equipment', 'staff'];

// Initially hide all sections
document.addEventListener("DOMContentLoaded", () => {
    sections.forEach(section => document.getElementById(section).style.display = 'none');
});

function showSection(selectedSection) {
    const section = document.getElementById(selectedSection);
    if (section.style.display === 'none' || section.style.display === '') {
        // Hide all sections first
        sections.forEach(sec => document.getElementById(sec).style.display = 'none');
        // Show only the clicked section
        section.style.display = 'block';
    } else {
        // Hide the section if it's already visible
        section.style.display = 'none';
    }
}


    function logout() {
        if (confirm("Are you sure you want to log out?")) {
            window.location.href = 'login-signup.html';
        }
    }