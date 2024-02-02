const https = require('https');
const fs = require('fs');
const url = 'https://www.google.com';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    fs.writeFile('index.html', data, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  });

}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
