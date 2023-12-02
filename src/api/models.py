from flask_sqlalchemy import SQLAlchemy
import hashlib

db = SQLAlchemy()

note_category_association = db.Table(
    'note_category_association',
    db.Column('note_id', db.Integer, db.ForeignKey('note.id')),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'))
)

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(80), unique=False, nullable=False)
    lastname = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    contact = db.Column(db.String(80), unique=False, nullable=False)
   
    notes = db.relationship('Note', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "contact": self.contact,
        # do not serialize the password, its a security breach
        }
    
    def set_password(self, password):
        """Cifra y guarda la contraseña del usuario."""
        self.password = hashlib.sha256(password.encode()).hexdigest()

    def check_password(self, password):
        """Verifica si la contraseña proporcionada es correcta."""
        return self.password == hashlib.sha256(password.encode()).hexdigest()

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(250), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    archived = db.Column(db.Boolean, default=False, nullable=False)
    
    # Establish a many-to-many relationship between notes and categories
    categories = db.relationship('Category', secondary=note_category_association, backref='notes', lazy='dynamic')

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "user_id": self.user_id,
            "archived": self.archived, 
           
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }
