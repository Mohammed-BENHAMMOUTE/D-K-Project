# Stage 1: Build
# Use Node.js 18 on Alpine with SHA256 pinning
# Using a specific version with SHA256 pinning ensures image consistency and security
FROM node:18-alpine@sha256:7e43a2d633d91e8655a6c0f45d2ed987aa4930f0792f6d9dd3bffc7496e44882 AS builder

# Metadata Labels
LABEL maintainer="Mohammed Benhammoute" \
    version="1.0" \
    description="React Frontend Application" \
    email="mohammedbenhammoute@gmail.com"

# Best Practice: Create a non-root user and home directory
# This enhances security by avoiding running the application as the root user.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /home/appuser/app && \
    chown -R appuser:appgroup /home/appuser

# Set the working directory
WORKDIR /home/appuser/app

# Switch to non-root user
USER appuser

# Best Practice: Copy package files and install dependencies
# Copying only package files first allows Docker to cache the npm ci step if dependencies haven't changed.
COPY --chown=appuser:appgroup package.json package-lock.json ./
RUN npm ci

# Best Practice: Copy source code after dependencies to maximize caching efficiency
# This ensures that changes in source code do not invalidate the cache for dependencies.
COPY --chown=appuser:appgroup . .

# Build the application
RUN npm run build

# Stage 2: Runtime
# Use Nginx with SHA256 pinning
# Using a specific version with SHA256 pinning ensures image consistency and security
FROM nginx:stable-alpine@sha256:d6f8c6b38edf2b7c6619718ad7a00caa4ed4741d12ce12550333a28d2b52dc89

# Metadata Labels
LABEL maintainer="Mohammed Benhammoute" \
    version="1.0" \
    description="React Frontend Application Runtime" \
    email="mohammedbenhammoute@gmail.com"

# Best Practice: Create a non-root user and home directory
# This enhances security by avoiding running the application as the root user.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /usr/share/nginx/html && \
    chown -R appuser:appgroup /usr/share/nginx/html

# Remove default Nginx configuration and add custom configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy build artifacts from builder stage
COPY --from=builder /home/appuser/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Best Practice: Implement a HEALTHCHECK to monitor application health
# This ensures that the container is running correctly and can restart it if it becomes unhealthy.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

# Best Practice: Use dumb-init as the ENTRYPOINT for proper signal handling and process management
# dumb-init handles reaping zombie processes and forwards signals to all processes in the container.
RUN apk add --no-cache dumb-init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]