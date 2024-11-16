document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the form submit
    document.getElementById('passwordResetForm').addEventListener('submit', resetPassword);

    // Add event listener to the show password checkbox
    document.getElementById('showPassword').addEventListener('change', togglePasswordVisibility);
});

function resetPassword(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect the passwords from the form
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate the passwords
    if (newPassword !== confirmPassword) {
        displayMessage('New passwords do not match.', 'error');
        return;
    }

    if (currentPassword === newPassword) {
        displayMessage('Current and new passwords are the same.', 'error');
        return;
    }

    if (!validatePassword(newPassword)) {
        displayMessage('Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and special characters.', 'error');
        return;
    }

    // Prepare the data to send to the backend
    const passwordData = {
        currentPassword: currentPassword,
        newPassword: newPassword
    };

    fetch('/api/reset-password/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Include CSRF token for security
        },
        body: JSON.stringify(passwordData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            displayMessage('Password reset successfully!', 'success');
        } else {
            displayMessage(data.message, 'error');
        }
    })
    .catch(error => console.error('Error resetting password:', error));
}

function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
}

function validatePassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}

function togglePasswordVisibility() {
    const passwordFields = document.querySelectorAll('#currentPassword, #newPassword, #confirmPassword');
    passwordFields.forEach(field => {
        if (this.checked) {
            field.type = 'text';
        } else {
            field.type = 'password';
        }
    });
}

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
