# Webhook Subscription Guide

Welcome to the webhook subscription guide. This document will walk you through the steps to subscribe to and interact with our webhook system, including how to initiate a subscription, check active transactions, and unsubscribe from the service.

## Subscribing to the Webhook

To start receiving webhook events, you need to subscribe by making a POST request to our server with specific details about your order and the endpoint on your server that will handle incoming webhook events.

### Initiating a Subscription

Send a POST request to the `/order` endpoint with an amount and the URL of your webhook handler as JSON data.

**Request:**

```http
POST https://infinite-wired-magpie.ngrok-free.app/order
```

**Payload:**

```json
{
  "amount": 100,
  "webhook": "http://yourserver.com/updatepayment"
}
```



Replace `http://yourserver.com/updatepayment` with the actual URL of your webhook handler.


A example can be seen in the integrator.js file.

## Checking Active Transactions

To view all active transactions, you can make a GET request to the `/transactions` endpoint. This will return a list of all transactions, which includes the IDs that you can use to manage your subscriptions.

**Request:**

```http
GET https://infinite-wired-magpie.ngrok-free.app/transactions
```

## Unsubscribing from the Webhook

If you wish to stop receiving webhook events for a particular subscription, you can unsubscribe by making a POST request to the `/cancelpayment/{id}` endpoint, where `{id}` is the ID of the subscription you want to cancel.

**Example:**

```http
POST https://infinite-wired-magpie.ngrok-free.app/cancelpayment/123
```


```json
{
  "orderId": "123",
}
```

Replace `123` with the actual ID of your subscription. A successful request will return a status code 200 and a confirmation message.

## Interacting with the Webhook System

Once your subscriptions are set up, your specified endpoint will receive POST requests from our system whenever an event is triggered.

### Example Webhook Handler

Below is a simple example of a webhook receiver endpoint using Node.js and Express:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post("/recieve_webhooks", (req, res) => {
    console.log(req.body);
    console.log(res.body)
    console.log('recieved webhook');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Ensure your server is properly configured to accept POST requests at the specified endpoint, and replace `/recieve_webhooks` with your actual endpoint path if different.

## Testing the Subscription

You can test your subscription by making a POST request to the `/ping` endpoint. This will prompt the system to send a test webhook event to all subscribed endpoints.

**Request:**

```http
POST https://infinite-wired-magpie.ngrok-free.app/ping
```
