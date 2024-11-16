document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Basic client-side validation
    if (!username || !password) {
        displayError('Both fields are required.');
        return;
    }

    // Perform login API call
    performLogin(username, password)
        .then(response => {
            if (response.success) {
                // Redirect on successful login
                window.location.href = response.redirectUrl; // Correct the redirect URL from response
            } else {
                // Display error message from backend
                displayError(response.message);
            }
        })
        .catch(error => {
            // Handle any unexpected errors
            displayError('An unexpected error occurred. Please try again later.');
        });
});

function performLogin(username, password) {
    return fetch("{% url 'admin_login' %}", { // Use Django's URL template tag
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Assuming you are using CSRF protection
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            return { success: true, redirectUrl: data.redirectUrl };
        } else {
            return { success: false, message: data.message };
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    });
}

function displayError(message) {
    alert(message); // Show an alert dialog with the error message

    const errorMessageElement = document.getElementById('errorMessage');
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
    }
}

// Show/Hide password functionality
document.getElementById('showPassword').addEventListener('change', function() {
    const passwordInput = document.getElementById('password');
    if (this.checked) {
        passwordInput.type = 'text'; // Show password
    } else {
        passwordInput.type = 'password'; // Hide password
    }
});

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
