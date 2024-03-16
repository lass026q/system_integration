const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

let webhooks = [];

app.post('/register', (req, res) => {
    const { url, eventType } = req.body;
    webhooks.push({ url, eventType });
    res.send({ message: 'Webhook registered successfully.' });
});

app.post('/unregister', (req, res) => {
    const { url, eventType } = req.body;
    webhooks = webhooks.filter(webhook => webhook.url !== url || webhook.eventType !== eventType);
    res.send({ message: 'Webhook unregistered successfully.' });
});

app.post('/ping', async (req, res) => {
    const promises = webhooks.map(webhook => axios.post(webhook.url, { eventType: 'ping' }));
    await Promise.all(promises);
    res.send({ message: 'Ping event sent to all registered webhooks.' });
});


app.listen(3000, () => console.log('Exposee server running on port 3000'));
