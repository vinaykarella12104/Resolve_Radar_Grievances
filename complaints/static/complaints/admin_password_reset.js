document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the form submit
    document.getElementById('passwordResetForm').addEventListener('submit', resetAdminPassword);

    // Add event listener to the show password checkbox
    document.getElementById('showPassword').addEventListener('change', toggleShowPassword);

    // Show password toggle
    function toggleShowPassword() {
        const passwordFields = [document.getElementById('currentPassword'), document.getElementById('newPassword'), document.getElementById('confirmPassword')];
        passwordFields.forEach(field => {
            field.type = this.checked ? 'text' : 'password';
        });
    }

    // Password reset form submission
    async function resetAdminPassword(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            showMessage('New passwords do not match.');
            return;
        }

        if (currentPassword === newPassword) {
            showMessage('Current and new passwords are the same.');
            return;
        }

        // Optionally validate password strength
        if (!validatePassword(newPassword)) {
            showMessage('Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and special characters.');
            return;
        }

        try {
            const response = await fetch("{% url 'reset_admin_password' %}", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (response.ok) {
                showMessage('Password reset successfully.', 'success');
            } else {
                const errorData = await response.json();
                showMessage(errorData.message || 'Failed to reset password.');
            }
        } catch (error) {
            showMessage('An error occurred. Please try again.');
        }
    }

    // Function to show message
    function showMessage(message, type = 'error') {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.style.color = type === 'error' ? 'red' : 'green';
    }

    // Optional: Password validation function
    function validatePassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordPattern.test(password);
    }
});
