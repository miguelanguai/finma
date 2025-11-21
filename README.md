# Finma

Aqui el readme de finma

## Despliegue local

En `.env`, poner `PROFILE` a `local` y realizar un `python manage.py runserver` desde el directorio `/backend`. El servicio arrancará desde el puerto 8000.

## Despliegue en docker desarrollo

En `.env`, poner `PROFILE` a `dev` y realizar un `docker compose up -d` desde el directorio raíz.

Se levantarán los servicios. Para tumbarlos: `docker compose down`.
