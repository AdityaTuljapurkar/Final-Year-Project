FROM python:3.11-slim

# Fixing python default features 
ENV PYTHONDONTWRITEBYTECODE 1 
ENV PYTHONUNBUFFERED 1    

# Installing linux and C tools 
RUN apt-get update && apt-get install -y \ 
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* 

# Setting work directory
WORKDIR /app

# Installing the requirements for the app 
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt 

# Copying the rest of the application code
COPY . . 

CMD [ "daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application" ]

