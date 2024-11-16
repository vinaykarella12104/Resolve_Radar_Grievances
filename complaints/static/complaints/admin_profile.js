    document.addEventListener('DOMContentLoaded', () => {
        // Fetch admin profile data and populate the form
        fetchAdminProfile();

        // Add event listener to the form submit
        document.getElementById('adminProfileForm').addEventListener('submit', updateAdminProfile);
    });

    function fetchAdminProfile() {
        fetch("{% url 'admin_profile_api' %}")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('username').value = data.username;
                document.getElementById('firstname').value = data.firstname;
                document.getElementById('lastname').value = data.lastname;
                document.getElementById('email').value = data.email;
                document.getElementById('phone').value = data.phone;
            })
            .catch(error => {
                console.error('Error fetching admin profile:', error);
                alert('Failed to load admin profile. Please try again later.');
            });
    }

    function updateAdminProfile(event) {
        event.preventDefault();

        const adminProfileData = {
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
        };

        // Basic form validation (add more as needed)
        if (!adminProfileData.email || !adminProfileData.firstname || !adminProfileData.lastname) {
            alert('Please fill in all required fields.');
            return;
        }

        fetch("{% url 'admin_profile_api' %}", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}'
            },
            body: JSON.stringify(adminProfileData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Admin profile updated successfully!');
        })
        .catch(error => {
            console.error('Error updating admin profile:', error);
            alert('Failed to update admin profile. Please try again later.');
        });
    }

    function getCookie(name) {
        let cookieArr = document.cookie.split(";");
        for(let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("=");
            if(name === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }

