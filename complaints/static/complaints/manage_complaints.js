function filterComplaints() {
    const filterValue = document.getElementById('complaintFilter').value;
    const rows = document.querySelectorAll('#complaintsTableBody tr');

    rows.forEach(row => {
        const status = row.querySelector('td:nth-child(6)').textContent;
        if (filterValue === 'all') {
            row.style.display = '';
        } else if (status.toLowerCase() === filterValue) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchComplaints();
});

async function fetchComplaints() {
    try {
        const response = await fetch('{% url "api_complaints" %}');
        const complaints = await response.json();
        populateComplaintTable(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
    }
}

function populateComplaintTable(complaints) {
    const tableBody = document.getElementById('complaintsTableBody');
    tableBody.innerHTML = '';

    complaints.forEach(complaint => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.id}</td>
            <td>${complaint.username}</td>
            <td>${complaint.role}</td>
            <td>${complaint.complaintType}</td>
            <td>${complaint.filedDate}</td>
            <td>${complaint.status}</td>
            <td>
                <button onclick="showComplaintDetails(${complaint.id})">Details</button>
                <button onclick="updateComplaintStatus(${complaint.id}, 'In Progress')">In Progress</button>
                <button onclick="updateComplaintStatus(${complaint.id}, 'Solved')">Solved</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function updateComplaintStatus(complaintId, status) {
    try {
        const response = await fetch(`{% url "api_complaint_update" complaint_id=complaintId %}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            fetchComplaints();
        } else {
            console.error('Error updating complaint status:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating complaint status:', error);
    }
}

async function showComplaintDetails(complaintId) {
    try {
        const response = await fetch(`{% url "api_complaint_details" complaint_id=complaintId %}`);
        const complaint = await response.json();
        displayComplaintDetails(complaint);
        document.getElementById('complaintDetailsModal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching complaint details:', error);
    }
}

function displayComplaintDetails(complaint) {
    const detailsDiv = document.getElementById('complaintDetails');
    detailsDiv.innerHTML = `
        <p><strong>Complaint ID:</strong> ${complaint.id}</p>
        <p><strong>Username:</strong> ${complaint.username}</p>
        <p><strong>Role:</strong> ${complaint.role}</p>
        <p><strong>Complaint Type:</strong> ${complaint.complaintType}</p>
        <p><strong>Filed Date:</strong> ${complaint.filedDate}</p>
        <p><strong>Status:</strong> ${complaint.status}</p>
        <p><strong>Description:</strong> ${complaint.description}</p>
    `;
}

function closeModal() {
    document.getElementById('complaintDetailsModal').style.display = 'none';
}
