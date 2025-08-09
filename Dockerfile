# Use Node.js 22 LTS as the builder
FROM node:22-slim as builder

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

# --- Production Stage ---

# Use a slim Node.js image for the final image
FROM node:22-slim

# Set working directory
WORKDIR /usr/src/app

# Copy production dependencies configuration
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose port
EXPOSE 3001

# Start the app
CMD ["node", "dist/index.js"]