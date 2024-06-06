from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define a model
class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)

# Create the database and tables

@app.route('/api/add_application', methods=['POST'])
def add_applications():
    if request.method == 'POST':
        data = request.get_json()
        new_application = Job(
            company_name=data['company_name'],
            date=datetime.strptime(data['date'], '%Y-%m-%d'),
            status=data['status']
        )
        db.session.add(new_application)
        db.session.commit()
        return jsonify(message = "Job application created"), 201

@app.route('/api/applications', methods=['GET'])
def view_applications():
    if request.method == 'GET':
        app = Job.query.all()
        applications_list = [{
            "id": app.id,
            "company_name": app.company_name,
            "date": app.date.strftime('%Y-%m-%d'),
            "status": app.status
        } for app in app]
        return jsonify(applications=applications_list)

@app.route('/api/del_application/<int:id>', methods=["DELETE"])
def delete_application(id):
    if request.method == 'DELETE':
        application = Job.query.get_or_404(id)
        db.session.delete(application)
        db.session.commit()
        return jsonify(message = "Job application deleted"), 200

@app.route('/api/update_status/', methods=['POST'])
def update_status():
    if request.method == 'POST':
        data = request.get_json()
        application = Job.query.get_or_404(data["id"])
        application.status = data["status"]
        db.session.commit()
        return jsonify(message = "Application Status Updated")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)
