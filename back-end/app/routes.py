from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import db, User, Inventory
from werkzeug.security import check_password_hash

auth_bp = Blueprint('auth', __name__)
inventory_bp = Blueprint('inventory', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Request body is missing'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({'message': 'Missing username, email, or password'}), 400

    user = User.query.filter_by(username=username, email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 400

    access_token = create_access_token(identity={'id': user.id})
    return jsonify({'message': 'Login successful', 'token': access_token}), 200

@inventory_bp.route('/add', methods=['POST'])
@jwt_required()
def add_inventory():
    data = request.get_json()
    if not data or not all(k in data for k in ['name', 'quantity', 'category']):
        return jsonify({'message': 'Missing required fields'}), 400

    user_id = get_jwt_identity()['id']
    new_item = Inventory(
        user_id=user_id,
        name=data['name'],
        quantity=data['quantity'],
        category=data['category']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@inventory_bp.route('/list', methods=['GET'])
@jwt_required()
def list_inventory():
    user_id = get_jwt_identity()['id']
    inventory = Inventory.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in inventory]), 200

# Helper method to serialize model to dict
def to_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}

Inventory.to_dict = to_dict
User.to_dict = to_dict