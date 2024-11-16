document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!newPassword || !confirmPassword) {
        displayMessage('Both fields are required.', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        displayMessage('Passwords do not match.', 'error');
        return;
    }

    fetch('/reset-password/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Get CSRF token
        },
        body: JSON.stringify({ password: newPassword }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayMessage('Password has been reset successfully.', 'success');
            // Redirect to login page after a delay
            setTimeout(() => {
                window.location.href = '{% url "login" %}';
            }, 2000);
        } else {
            displayMessage(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage('An unexpected error occurred. Please try again later.', 'error');
    });
});

document.getElementById('newPassword').addEventListener('input', function() {
    const newPassword = document.getElementById('newPassword').value.trim();
    validatePassword(newPassword);
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (newPassword !== confirmPassword) {
        displayMessage('Passwords do not match.', 'error');
    } else {
        displayMessage('', 'success');
    }
});

function validatePassword(password) {
    const messageElement = document.getElementById('message');
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[^A-Za-z0-9]/.test(password);

    if (password.length < 5) {
        messageElement.textContent = 'Password must be at least 5 characters long.';
        messageElement.style.color = 'red';
    } else if (!uppercase) {
        messageElement.textContent = 'Password must contain at least one uppercase letter.';
        messageElement.style.color = 'red';
    } else if (!lowercase) {
        messageElement.textContent = 'Password must contain at least one lowercase letter.';
        messageElement.style.color = 'red';
    } else if (!number) {
        messageElement.textContent = 'Password must contain at least one number.';
        messageElement.style.color = 'red';
    } else if (!specialChar) {
        messageElement.textContent = 'Password must contain at least one special character.';
        messageElement.style.color = 'red';
    } else {
        messageElement.textContent = '';
    }
}


// Show/Hide password functionality
document.getElementById('showPassword').addEventListener('change', function() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (this.checked) {
        newPasswordInput.type = 'text'; // Show new password
        confirmPasswordInput.type = 'text'; // Show confirm password
    } else {
        newPasswordInput.type = 'password'; // Hide new password
        confirmPasswordInput.type = 'password'; // Hide confirm password
    }
});


function displayMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.color = type === 'error' ? 'red' : 'green';
}

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
