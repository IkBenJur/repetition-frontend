# ============================
# Build
# ============================

# Build stage. We use a builder and runner step.
# Tailwind only needed in the build step
FROM node:23-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . ./

# Declare ARG to receive Railway environment variables
ARG VITE_API_URL

# Set as ENV so Vite can access it during build
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npm run build

# ============================
# Serve
# ============================
# Serve the build
FROM node:23-alpine AS runner

# Set working directory
WORKDIR /app

# Install serve
RUN npm i -g serve

# Copy only the built artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Open port 3000
EXPOSE 3000

# Serve
CMD [ "serve", "-s", "dist" ]