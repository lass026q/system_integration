const express = require('express');
const path = require('path');
const app = express();

// Endpoint to serve the HTML page
app.get('/get-date', (req, res) => {
  // Send the HTML page
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server on port 8080
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
