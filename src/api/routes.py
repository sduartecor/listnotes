"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import hashlib
import json

api = Blueprint('api', __name__)


# Register
@api.route('/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    firstname = request.json.get('firstname')
    lastname = request.json.get('lastname')
    contact = request.json.get('contact')

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

     # Verifico username que no exista
    user_query = User.query.filter_by(email=email).first() 

    if email == "":
        return jsonify({"msg": "Email can't be empty"}), 406
    if password == "":
        return jsonify({"msg": "Password can't be empty"}), 406
    if firstname == "":
        return jsonify({"msg": "Firstname can't be empty"}), 406
    if lastname == "":
        return jsonify({"msg": "Lastname can't be empty"}), 406
    if contact == "":
        return jsonify({"msg": "Contact can't be empty"}), 406

    if user_query is None:
        new_user = User(email=email, password=hashed_password,firstname=firstname,lastname=lastname,contact=contact)
        db.session.add(new_user)
        db.session.commit()
        return {'msg': 'New user created'}, 201
    
    return jsonify({"msg": "User exists"}), 406

# Log in
@api.route('/login', methods=['POST'])
def login():
    # 
    email = request.json.get('email')
    password = request.json.get('password')

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    user = User.query.filter_by(email=email, password=hashed_password).first()

    if user is None:
        return jsonify({"msg":"User doesn't exist"}), 404
    
    if email != user.email or not hashed_password:
        return jsonify({"msg": "Bad email or password"}), 401
    # Grants a token if login was successful
    else:
        access_token = create_access_token(identity=email)
            # Shows the token and the user info
        return jsonify({"msg": access_token,"user": user.serialize()}), 200

# Validate token
@api.route("/valid-token", methods=["GET"])
@jwt_required()
def valid_token():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    # Same as login, if the query brings nothing then it doesn't exist

    if current_user is None:
        return jsonify({"User not logged in"}), 402

    elif user is None:
        return jsonify({"status":False}), 404
    # If user is correct then it shows the user's info
    return jsonify({"status": True,"user": user.serialize()  }), 200
