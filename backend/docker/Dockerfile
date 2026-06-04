FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED=1

COPY backend/requirements-pypi.txt /app/

RUN pip install --no-cache-dir -r /app/requirements-pypi.txt gunicorn

COPY backend /app/

EXPOSE 8000

RUN chmod +x /app/docker/start.sh

CMD ["/bin/bash", "/app/docker/start.sh"]
