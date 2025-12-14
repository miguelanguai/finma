# Finma

Aqui el readme de finma

## Despliegue local

En `.env`, poner `PROFILE` a `local` y realizar un `python manage.py runserver` desde el directorio `/backend`. El servicio arrancará desde el puerto 8000.

## Despliegue en docker desarrollo

En `.env`, poner `PROFILE` a `dev` y realizar un `docker compose up -d` desde el directorio raíz.

Se levantarán los servicios. Para tumbarlos: `docker compose down`.

## Diseño E/R

![diseño](/readme-assets/finma.drawio.png)

En la imagen se puede ver el diseño de la base de datos que se aplica en la construccion de los modelos de Django.

## Archivo XLSX

En la carpeta readme-assets se puede encontrar un archivo `.xlsx` para visualizar como funciona.

Para que funcione el procesamiento del archivo, debe cumplir estos requisitos:

1. Los nombres de las columnas del excel deben situarse en la fila 8
2. Los nombres de las columnas tienen que ser: Fecha operación, Fecha valor, Concepto, Importe, Saldo y Divisa.
