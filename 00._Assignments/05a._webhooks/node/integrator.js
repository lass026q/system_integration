const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('Webhook event received:', req.body);
    res.send({ message: 'Webhook received.' });
});

const registerWebhook = async () => {
    const url = 'http://localhost:3000/register'; // Exposee's registration endpoint
    const webhookUrl = 'http://localhost:3001/webhook'; // Your webhook endpoint
    const eventType = 'payment received'; // The event type you're interested in

    try {
        const response = await axios.post(url, { url: webhookUrl, eventType });
        console.log(response.data);
    } catch (error) {
        console.error('Error registering webhook:', error);
    }
};

registerWebhook();
app.listen(3001, () => console.log('Integrator server running on port 3001'));





