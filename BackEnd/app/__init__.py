from flask import Flask
from flask_cors import CORS
from app.routes import items_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    app.register_blueprint(items_bp)
    return app
