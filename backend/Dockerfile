# Usa la imagen base de Python 3.9
FROM python:3.12.2

# Setea las variables de entorno
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala las dependencias del sistema
RUN apt-get update && apt-get install -y \
    mariadb-client \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo en el contenedor
WORKDIR /code

# Instala las dependencias de Python
COPY requirements.txt /code/
RUN pip install -r requirements.txt

# Copia el proyecto Django al contenedor
COPY . /code/
