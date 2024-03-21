import express from 'express';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';


const app = express();

app.use(express.json());

//function to generate random int for order id
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

app.post('/order', express.json(), (req, res) => {
    const {amount, webhook} = req.body; // my webhook URL

            const orderId = getRandomInt(100);
            res.send({orderId: orderId, status: 'pending'});

            // Send a POST request to the payment solution
            fetch('https://infinite-wired-magpie.ngrok-free.app/payment', { // exposee webhook URL
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({orderId: orderId, amount: amount, webhook: webhook})
            }).catch(err => console.error(err.message));
        }
    );

app.post('/updatepayment', express.json(), (req, res) => {
    const { orderId, status } = req.body;

    console.log(req.body);
});

app.post("/recieve_webhooks", (req, res) => {
    console.log(req.body);
    console.log(res.body)
    console.log('recieved webhook');
});


const PORT = 3000
app.listen(PORT, () => {console.log(`http://localhost:${PORT}`)});

process.on('exit', () => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Closed the database connection.');
    });
  });


