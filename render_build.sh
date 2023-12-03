#!/usr/bin/env bash
# exit on error
set -o errexit

# Instala las dependencias de Node.js y ejecuta la construcción de la aplicación React
npm install
npm run build

# Instala las dependencias de Python utilizando pipenv
pipenv install

# Carga las variables de entorno del archivo .env antes de ejecutar cualquier comando
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Ejecuta el comando de actualización (pipenv run upgrade en este caso)
pipenv run upgrade
