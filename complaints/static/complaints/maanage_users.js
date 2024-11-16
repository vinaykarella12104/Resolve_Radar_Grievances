document.addEventListener("DOMContentLoaded", function() {
    fetchUsers();
});

function fetchUsers() {
    fetch("{% url 'manage_users_api' %}")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = "";
            data.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>${user.status}</td>
                    <td>
                        <button onclick="editUser(${user.id})">Edit</button>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching users:", error));
}

function showUserModal(user = null) {
    const modal = document.getElementById("userModal");
    const closeBtn = modal.querySelector(".close");
    const form = modal.querySelector("form");
    const modalTitle = modal.querySelector("#modalTitle");

    form.reset();
    if (user) {
        modalTitle.textContent = "Edit User";
        form.userId.value = user.id;
        form.username.value = user.username;
        form.firstName.value = user.firstName;
        form.lastName.value = user.lastName;
        form.email.value = user.email;
        form.mobile.value = user.mobile;
        form.role.value = user.role;
        form.department.value = user.department;
    } else {
        modalTitle.textContent = "Add User";
    }

    modal.style.display = "block";

    closeBtn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    form.onsubmit = function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);
        const url = user ? `{% url 'update_user_api' user.id %}` : "{% url 'add_user_api' %}";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchUsers();
                modal.style.display = "none";
            } else {
                console.error("Error saving user:", data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    };
}

function editUser(userId) {
    fetch(`{% url 'get_user_api' userId %}`)
        .then(response => response.json())
        .then(user => showUserModal(user))
        .catch(error => console.error("Error fetching user:", error));
}

function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        fetch(`{% url 'delete_user_api' userId %}`, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchUsers();
            } else {
                console.error("Error deleting user:", data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}
