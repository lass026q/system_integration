import express from 'express';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';

const app = express();

/* let db = new sqlite3.Database('./mydb.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the mydb.sqlite database.');
  }); */

app.post('/order', express.json(), (req, res) => {
    const {amount} = req.body;
    const webhook = ''; // my webhook URL

    db.run(`INSERT INTO orders (amount, payment_status) VALUES (?,?)`, [amount, 'pending'], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({message: 'Internal Server Error'});
        } else {
            const orderId = this.lastID;
            res.send({orderId: orderId, status: 'pending'});

            // Send a POST request to the payment solution
            fetch('https://infinite-wired-magpie.ngrok-free.app/payment', { // exposee webhook URL
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({orderId: orderId, amount: amount, webhook: webhook})
            }).catch(err => console.error(err.message));
        }
    });
});

app.post('/updatepayment', express.json(), (req, res) => {
    const { orderId, status } = req.body;

    console.log(req.body);

    /* // update the payment status in the database
    db.run(`UPDATE orders SET payment_status = ? WHERE id = ?`, [status, orderId], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            res.send({ orderid: orderId, status: status });
            console.log('updated payment status');
            console.log(orderId, status);
        }
    }); */
});

app.post("/recieve_webhooks", (req, res) => {
    console.log(req.body);
    console.log(res.body)
    console.log('recieved webhook');
    res.send({message: 'Pinged all webhooks'});
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


