import express from 'express';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';

const app = express();

// Creating a new database (or open it if it already exists)
let db = new sqlite3.Database('./mydb.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the mydb.sqlite database.');
  });

db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderid REAL,
    amount REAL,
    status TEXT DEFAULT 'pending',
    webhook TEXT
    )`, (err) => {
    if (err) {
    console.error(err.message);
    }
    console.log('Created the transaction table.');
    });


db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    payment_status TEXT 
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Created the orders table.');
});


app.get('/', (req, res) => {
    res.send({message: 'Hello World!'});
});


app.post('/payment', express.json(), (req, res) => {
    console.log(req.body);
    const {orderId, amount, webhook} = req.body;

    db.run(`INSERT INTO transactions (orderid, amount, webhook) VALUES (?,?,?)`, [orderId,amount,webhook], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({message: 'Internal Server Error'});
        } else {
            res.send({orderid: orderId, status: 'pending'});
        }
    });
});

app.post('/cancelpayment/:id', express.json(), (req, res) => {
    const {orderId} = req.body;

    db.run(`DELETE FROM transactions WHERE orderid = ?`, [orderId], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            if (this.changes > 0) {
                res.send({ order_id: orderId, status: 'cancelled' });
            } else {
                res.status(404).send({ message: 'Transaction not found' });
            }
        }
    });
});


app.get('/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions`, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({message: 'Internal Server Error'});
        } else {
            res.send(rows);
        }
    });
});

app.post('/update/:id/:status', (req, res) => {
    const { id, status } = req.params;

    // Validate status
    if (status !== 'success' && status !== 'failure') {
        res.status(400).send({ message: 'Invalid status' });
        return;
    }

    db.get(`SELECT * FROM transactions WHERE orderid = ?`, [id], async (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Internal Server Error' });
        } else if (row) {
            db.run(`UPDATE transactions SET status = ? WHERE orderid = ?`, [status, id], function(err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send({ message: 'Internal Server Error' });
                } else {

                    try {
                        const sendStatus = async () => {
                            const response = await fetch(row.webhook, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ orderid: row.orderid, status: status }) 
                            });
                            res.send({ orderid: row.orderid, status: status });
                        };
                        sendStatus();
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send({ message: 'Failed to send status to webhook' });
                    }
                }
            });
        } else {
            res.status(404).send({ message: 'Transaction not found' });
        }
    });c
});

app.get('/ping', (req, res) => {
    //send a ping to all webhooks
    db.all(`SELECT * FROM transactions WHERE status='pending'`, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({message: 'Internal Server Error'});
        } else {
            rows.forEach(row => {
                fetch(row.webhook, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({transaction_id: row.id, status: 'pending'})
                }).then(res => res.json())
                .then(json => {
                    console.log(json);
                });
            });
            res.send({message: 'Pinged all webhooks'});
        }
    });
});


app.post('/updatepayment', express.json(), (req, res) => {
    const { orderId, status } = req.body;

    console.log(req.body);

    // update the payment status in the database
    db.run(`UPDATE orders SET payment_status = ? WHERE id = ?`, [status, orderId], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            res.send({ orderid: orderId, status: status });
        }
    });
});

const PORT = 8080
app.listen(PORT, () => {console.log(`http://localhost:${PORT}`)});


process.on('exit', () => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Closed the database connection.');
    });
  });