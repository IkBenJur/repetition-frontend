# Build stage
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Install serve
RUN npm i -g serve

# Copy source code
COPY . ./

# Build
RUN npm run build

# Open port 3000
EXPOSE 3000

# Serve
CMD [ "serve", "-s", "dist" ]