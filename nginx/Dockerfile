# Angular + Nginx Dockerfile
# Este Dockerfile crea una imagen de Docker para servir una aplicación Angular con Nginx.
# La imagen se basa en la imagen oficial de Nginx y copia los archivos de la aplicación Angular en el contenedor.
# La imagen resultante se puede usar para desplegar la aplicación en un servidor Nginx.

# Angular
FROM node:18-alpine AS build

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el resto del código fuente
COPY frontend/ /app/

# Instala las dependencias de Angular
RUN npm install

# Construye la aplicación Angular para producción
RUN npm run build --configuration=development

# Nginx
FROM nginx:latest

# Instalar curl: pruebas y debug
RUN apt-get update && apt-get install -y wget && apt-get install curl -y

# Copiar la configuración personalizada de Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos estáticos al directorio de Nginx
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Exponer los puertos 80 y 443
EXPOSE 80 443

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]