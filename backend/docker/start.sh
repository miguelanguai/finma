#!/bin/bash

# Activar el entorno de Conda
source /opt/conda/bin/activate finma

# Ejemplo para una imagen basada en python:3.12-slim
RUN apt-get update && apt-get install -y postgresql-server-dev-all

# Esperar a que la base de datos esté lista
echo "Esperando a que PostgreSQL inicie..."
until nc -z -v -w30 postgres 5432
do
  echo "Esperando a la base de datos..."
  sleep 1
done
echo "PostgreSQL está disponible."

# Aplicar migraciones
echo "Aplicando migraciones..."
python manage.py migrate

# Iniciar Gunicorn para servir Django
echo "Iniciando el servidor..."
exec gunicorn root.wsgi:application --bind 0.0.0.0:8000 --access-logfile - --error-logfile -