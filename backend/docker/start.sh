#!/bin/bash

source /opt/conda/bin/activate finma

echo "Esperando a que PostgreSQL inicie..."
until nc -z -v -w30 postgres 5432
do
  echo "Esperando a la base de datos..."
  sleep 1
done
echo "PostgreSQL está disponible."

export PROFILE=local

echo "Aplicando migraciones..."
python manage.py makemigrations
python manage.py migrate

echo "Recopilando archivos estáticos..."
python manage.py collectstatic --noinput

echo "Iniciando el servidor..."
exec gunicorn root.wsgi:application --bind 0.0.0.0:8000 --access-logfile - --error-logfile -
