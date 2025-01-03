function loadHTML() {
  fetch('./assets/index.html') // Path to your index.html file
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load HTML file');
      }
      return response.text(); // Parse the response as text
    })
    .then(data => {
      // Inject the HTML content into the page
      document.getElementById('content').innerHTML = data;
    })
    .catch(error => {
      console.error('Error loading HTML:', error);
    });
}

// Call the loadHTML function when the page loads
window.onload = function() {
  loadHTML();
};