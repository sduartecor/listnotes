"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Note, Category
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
        access_token = create_access_token(identity=user.id)
            # Shows the token and the user info
        return jsonify({"msg": access_token,"user": user.serialize()}), 200

# Validate token
@api.route("/valid-token", methods=["GET"])
@jwt_required()
def valid_token():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    # Same as login, if the query brings nothing then it doesn't exist

    if current_user is None:
        return jsonify({"User not logged in"}), 402

    elif user is None:
        return jsonify({"status":False}), 404
    # If user is correct then it shows the user's info
    return jsonify({"status": True,"user": user.serialize()  }), 200

# NOTAS

# Get Notes Active for the authenticated user
@api.route('/noteActive', methods=['GET'])
@jwt_required()
def getNotesActive():
    current_user_id = get_jwt_identity()  # Obtén el ID del usuario autenticado

    notes = Note.query.filter_by(user_id=current_user_id, archived=False).all()
    all_notes = list(map(lambda item: item.serialize(), notes))

    return jsonify(all_notes), 200

# Get Notes Archived for the authenticated user
@api.route('/noteArchived', methods=['GET'])
@jwt_required()
def getNotesArchived():
    current_user_id = get_jwt_identity()  # Obtén el ID del usuario autenticado

    notes = Note.query.filter_by(user_id=current_user_id, archived=True).all()
    all_notes = list(map(lambda item: item.serialize(), notes))

    return jsonify(all_notes), 200

# Create Notes
@api.route('/note', methods=['POST'])
def create_note():
    # Obtener datos de la solicitud JSON
    content = request.json.get('content')
    user_id = request.json.get('user_id')
    archived = request.json.get('archived')

    # Crear la nota
    new_note = Note(content=content, user_id=user_id, archived=archived)

    # Agregar la nota a la base de datos
    db.session.add(new_note)
    db.session.commit()

    response_body = {
            "msg": "La nota fue creada con exito"
    }
    return jsonify(response_body), 200

# 
@api.route('/note/<int:note_id>/archived', methods=['PUT'])
def archivedNote(note_id):
    body = json.loads(request.data)

    note = Note.query.filter_by(id=note_id).first()
    
    if note is not None:
        note.archived = True
        
        db.session.add(note)
        db.session.commit()

        response_body = {
            "msg": "La nota fue archivada con exito"
        }
        return jsonify(response_body), 200
    
    response_body = {
            "msg": "La nota no existe en el sistema"
    }
    
    return jsonify(response_body), 400

@api.route('/note/<int:note_id>/unarchived', methods=['PUT'])
def unarchivedNote(note_id):
    body = json.loads(request.data)

    note = Note.query.filter_by(id=note_id).first()
    
    if note is not None:
        note.archived = False
        
        db.session.add(note)
        db.session.commit()

        response_body = {
            "msg": "La nota fue archivada con exito"
        }
        return jsonify(response_body), 200
    
    response_body = {
            "msg": "La nota no existe en el sistema"
    }
    
    return jsonify(response_body), 400

@api.route('/note/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    # Obtener datos de la solicitud JSON
    content = request.json.get('content')

    # Obtener la nota existente por ID
    note = Note.query.get(note_id)

    # Verificar si la nota existe
    if not note:
        return jsonify({"error": "La nota no existe"}), 404

    # Actualizar la nota
    note.content = content if content is not None else note.content

    # Guardar los cambios en la base de datos
    db.session.commit()

    response_body = {
        "msg": "La nota fue actualizada con éxito"
    }
    return jsonify(response_body), 200

@api.route('/note/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    # Obtener la nota existente por ID
    note = Note.query.get(note_id)

    # Verificar si la nota existe
    if not note:
        return jsonify({"error": "La nota no existe"}), 404

    # Eliminar la nota de la base de datos
    db.session.delete(note)
    db.session.commit()

    response_body = {
        "msg": "La nota fue eliminada con éxito"
    }
    return jsonify(response_body), 200

# Category
    
# Create Notes
@api.route('/category', methods=['POST'])
def create_category():
    # Obtener datos de la solicitud JSON
    name = request.json.get('name')
    user_id = request.json.get('user_id')
    color = request.json.get('color')

    # Crear la nota
    new_category = Category(name=name, user_id=user_id, color=color)

    # Agregar la nota a la base de datos
    db.session.add(new_category)
    db.session.commit()

    response_body = {
            "msg": "La categoria fue creada con exito"
    }
    return jsonify(response_body), 200

# Get Notes Active for the authenticated user
@api.route('/category', methods=['GET'])
@jwt_required()
def getCategory():
    current_user_id = get_jwt_identity()  # Obtén el ID del usuario autenticado

    categorys = Category.query.filter_by(user_id=current_user_id).all()
    all_category = list(map(lambda item: item.serialize(), categorys))

    return jsonify(all_category), 200

# Add category to note
@api.route('/category/note', methods=['POST'])
@jwt_required()
def categoryNote():
    current_user_id = get_jwt_identity()

    # Asegurarse de que la solicitud contenga los datos necesarios
    data = request.get_json()
    note_id = data.get('note_id')
    category_id = data.get('category_id')

    if not note_id or not category_id:
        return jsonify({"mensaje": "Se requieren tanto 'note_id' como 'category_id'."}), 400

    # Verificar si la nota y la categoría existen y pertenecen al usuario actual
    note = Note.query.filter_by(id=note_id, user_id=current_user_id).first()
    category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()

    if not note or not category:
        return jsonify({"mensaje": "Nota o categoría no encontrada o no pertenece al usuario."}), 404

    # Vincular la nota a la categoría
    note.categories.append(category)
    db.session.commit()

    response_body = {
            "msg": "Nota vinculada a la categoría exitosamente."
    }
    return jsonify(response_body), 200