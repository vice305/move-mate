from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
from .models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

   
    class CustomJSONEncoder(app.json_encoder):
        def default(self, obj):
            try:
                return super().default(obj)
            except TypeError:
                return str(obj)  # Fallback for unserializable objects

    app.json_encoder = CustomJSONEncoder

    db.init_app(app)
    JWTManager(app)
    CORS(app)

    with app.app_context():
        db.create_all()  

    from .routes import auth_bp, inventory_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')

    return app