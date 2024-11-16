document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch statistics from the API
    async function fetchStatistics() {
        try {
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            document.getElementById('error').style.display = 'none';

            // Fetch data from the Django API endpoint
            const response = await fetch('{% url "statistics_api" %}');
            
            // Check if the response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            // Parse the JSON data from the response
            const data = await response.json();
            
            // Update the HTML elements with the data
            document.getElementById('totalComplaints').textContent = data.totalComplaints;
            document.getElementById('solvedComplaints').textContent = data.solvedComplaints;
            document.getElementById('inProgressComplaints').textContent = data.inProgressComplaints;

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('error').style.display = 'block';
        } finally {
            // Hide loading indicator
            document.getElementById('loading').style.display = 'none';
        }
    }
    
    // Call the fetch function on page load
    fetchStatistics();
});
