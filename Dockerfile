# Use an official Node.js runtime as parent image
FROM node:18-bullseye-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PORT=5000

# Set working directory
WORKDIR /app

# Install system dependencies, python3, pip, and python-is-python3, and clean cache
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    python-is-python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN python3 -m pip install --upgrade pip

# Install PyTorch CPU-only first to keep image lightweight (saves gigabytes of GPU drivers)
RUN pip3 install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Copy requirements.txt and install Python dependencies
COPY requirements.txt /app/
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy package.json and package-lock.json for backend
COPY aml-backend/package*.json /app/aml-backend/

# Install backend dependencies
WORKDIR /app/aml-backend
RUN npm ci --only=production

# Return to /app and copy all other project files
WORKDIR /app
COPY run_pipeline.py /app/
COPY configs /app/configs/
COPY lib /app/lib/
COPY models /app/models/
COPY src /app/src/
COPY utils /app/utils/
COPY aml-backend /app/aml-backend/

# Expose port
EXPOSE 5000

# Start backend server
WORKDIR /app/aml-backend
CMD ["npm", "start"]
