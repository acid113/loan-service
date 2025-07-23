# Use Node.js 22 LTS
FROM node:22-slim

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies first (for caching)
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the TypeScript code
RUN npm run build

# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# PostgreSQL environment variables
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=loans

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
