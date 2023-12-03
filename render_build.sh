#!/usr/bin/env bash
# exit on error
set -o errexit

# Save the current FLASK_ENV
ORIGINAL_FLASK_ENV=$FLASK_ENV

# Set FLASK_ENV to development for the build
export FLASK_ENV=development

echo "FLASK_ENV is set to: $FLASK_ENV"

npm install
npm run build

pipenv install
pipenv run upgrade

# Restore the original FLASK_ENV
export FLASK_ENV=$ORIGINAL_FLASK_ENV
