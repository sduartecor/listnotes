### Considerations:

In the src, there are the two folders 'Api' which is the backend and 'Front' which is the frontend of the app.

### Program Installation:

Python 3.10=
Linux (Manual installation): https://cloudcone.com/docs/article/how-to-install-python-3-10-on-debian-11/
Windows: https://www.python.org/downloads/release/python-31011/

PostgreSQL=
Link page for Download: https://www.postgresql.org/download/
(Recommended password is: root)

Node.js=
Link page for Download: https://nodejs.org/en/download/current

- Verify that the programs have been integrated into the PATH.

### To save installation and configuration time you can use the page at this link:

Link: https://page-notes.onrender.com/

Account:

- Email: santiago@gmail.com
- Password: santi

Although you can register and create your own account

### Back-End Manual Installation:

1. Install pipenv: `$ pip install pipenv`
2. Install the python packages: `$ pipenv install`
3. Create a .env file based on the .env.example: `$ cp .env.example .env`
4. Install your database engine and create your database, depending on your database you have to create a DATABASE_URL variable with one of the possible values, make sure yo replace the valudes with your database information:

| Engine    | DATABASE_URL                                        |
| --------- | --------------------------------------------------- |
| Postgress | postgres://username:password@localhost:5432/example |

6. Reset migration: `$ Remove-Item -Recurse -Force ./migrations `
7. Init the migration: `$ pipenv run init`
8. Create database in postgress: `$ psql -U postgres -c 'CREATE DATABASE example;'` (You must enter the password you entered at installation.)
9. Create extension: `$ psql -U postgres -c 'CREATE EXTENSION unaccent;' -d example`
10. Create migrations: `$ pipenv run migrate`
11. Run the migrations: `$ pipenv run upgrade`
12. Run the application: `$ pipenv run start`

### Backend Users:

The site has a registration method, you can use it to create an account and use the site.

### Front-End Manual Installation:

1. Install the packages: `$ npm install`
2. start the webpack dev server `$ npm run start`

### Extras:

The configuration of the environment can be lengthy, so the use of the deployed page is recommended:
Link: https://page-notes.onrender.com/
