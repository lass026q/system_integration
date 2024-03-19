from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import requests
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///subscriptions.db')
db = SQLAlchemy(app)

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    event = db.Column(db.String, nullable=False)

# Initialize the database
with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or 'url' not in data or 'event' not in data:
        return jsonify({'error': 'Request body missing required parameters. (See documentation)'}), 400

    subscription = Subscription(url=data['url'], event=data['event'])
    db.session.add(subscription)
    db.session.commit()

    return jsonify({'message': f'Subscribed to webhook: {data}'}), 201

@app.route('/unregister/<int:id>', methods=['POST'])
def unregister(id):
    subscription = Subscription.query.get(id)
    if not subscription:
        return jsonify({'error': 'Subscription with given id does not exist.'}), 400

    db.session.delete(subscription)
    db.session.commit()

    return jsonify({'message': f'Subscription with ID {id} deleted successfully'}), 200

def respond_to_webhooks(event, msg):
    subscriptions = Subscription.query.filter_by(event=event).all()
    for s in subscriptions:
        try:
            requests.post(s.url, json={'message': msg}, headers={'Content-Type': 'application/json'})
        except requests.RequestException as e:
            print(f"Error notifying {s.url}: {e}")

@app.route('/create_activity', methods=['POST'])
def create_activity():
    respond_to_webhooks('activity_created', 'Activity was created')
    return jsonify({'message': 'Activity was created.'}), 200

@app.route('/delete_activity', methods=['POST'])
def delete_activity():
    respond_to_webhooks('activity_deleted', 'Activity was deleted')
    return jsonify({'message': 'Activity was deleted.'}), 200

@app.route('/ping', methods=['GET'])
def ping():
    subscriptions = Subscription.query.all()
    data = {'ping': 'Ping ping'}
    for s in subscriptions:
        try:
            requests.post(s.url, json=data, headers={'Content-Type': 'application/json'})
        except requests.RequestException as e:
            print(f"Error pinging {s.url}: {e}")
    return jsonify({'msg': 'ping'}), 200

@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    subscriptions = Subscription.query.all()
    return jsonify([{'id': s.id, 'url': s.url, 'event': s.event} for s in subscriptions]), 200

if __name__ == '__main__':
    app.run(port=8080)
