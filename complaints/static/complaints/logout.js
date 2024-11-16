// Function to handle the student login button click
document.getElementById('studentLoginButton').onclick = function() {
    location.href = "{% url 'student_login' %}";
};

// Function to handle logout actions if needed
function handleLogout() {
    // You can add any specific logout actions here if needed
    // For example, clearing session data or making a call to the backend to invalidate the session

    // For now, we are just logging out a message to the console
    console.log('User logged out successfully.');
}

// Event listener for DOMContentLoaded to ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Call the handleLogout function when the page loads
    handleLogout();

    // Optionally, you can add more functionality here
    // For example, showing a message or redirecting after a certain period
    setTimeout(() => {
        location.href = "{% url 'login' %}"; // Redirect to login page after a delay (e.g., 5 seconds)
    }, 5000); // 5000 milliseconds = 5 seconds
});
