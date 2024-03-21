# Webhook Subscription Service Guide

This is a small test  of webhooks using python
The webserver is hosted with ngrok, it may not be running at the time of your review.
https://infinite-wired-magpie.ngrok-free.app

## Features

- **Subscription Registration**: Register your endpoint to receive notifications.
- **Subscription Unregistration**: Remove your endpoint from receiving further notifications.
- **Event Notifications**: Automatically notify registered endpoints when specific events occur.
- **Subscription Management**: View all active subscriptions.

## Getting Started

Ensure you have an endpoint ready on your server to handle incoming webhook notifications.

### Register a Subscription

To subscribe, send a POST request with the endpoint URL and the event you're interested in.

#### Request:

```http
POST /register
Host: ""
Content-Type: application/json

{
  "url": "http://your-endpoint.com/webhook",
  "event": "activity_created"
}
```

- `url`: Your endpoint that will receive the webhook notifications.
- `event`: The event type you want to subscribe to (e.g., `activity_created`).

#### Response:

```json
{
  "message": "Subscribed to webhook: {subscription details}"
}
```

### Unregister a Subscription

To stop receiving notifications, send a POST request with the subscription ID you wish to unregister.

#### Request:

```http
POST /unregister/{id}
Host: ""
```

- Replace `{id}` with the actual ID of your subscription.

#### Response:

```json
{
  "message": "Subscription with ID {id} deleted successfully"
}
```

### Triggering Events

The service can simulate event notifications for testing purposes.

#### Create Activity:

```http
POST /create_activity

```

This endpoint simulates an `activity_created` event and notifies all subscribers of this event.

#### Delete Activity:

```http
POST /delete_activity 
```

This endpoint simulates an `activity_deleted` event and notifies all subscribers of this event.

### Ping Subscriptions

To test the connectivity and responsiveness of all registered endpoints, you can use the `/ping` endpoint.

#### Request:

```http
GET /ping 
Host: ""
```

This will send a test payload to all registered endpoints.

### View Active Subscriptions

To view all current subscriptions, use the `/subscriptions` endpoint.

#### Request:

```http
GET /subscriptions
Host: ""
```

#### Response:

A list of all active subscriptions with their IDs, URLs, and subscribed events.

---

Ensure your endpoint is prepared to receive and process JSON payloads and respond appropriately to confirm receipt of the notifications. For further assistance or to report issues, please contact the service administrator.