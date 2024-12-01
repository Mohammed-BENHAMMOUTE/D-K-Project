# Stage 1: Build
# Use Node.js 18 on Alpine with SHA256 pinning
FROM node:18-alpine@sha256:<SHA256_HASH> AS builder

# Metadata Labels
LABEL maintainer="Mohammed BENHAMMOUTE" \
      version="1.0" \
      description="React Frontend Application" \
      email="mohammedbenhammoute@gmail"

# Create a non-root user and home directory
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /home/appuser/app && \
    chown -R appuser:appgroup /home/appuser

# Set working directory
WORKDIR /home/appuser/app

# Switch to non-root user
USER appuser

# Copy package files and install dependencies
COPY --chown=appuser:appgroup package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY --chown=appuser:appgroup . .

# Build the application
RUN npm run build

# Stage 2: Runtime
# Use Nginx with SHA256 pinning
FROM nginx:stable-alpine@sha256:<SHA256_HASH>

# Metadata Labels
LABEL maintainer="Your Name <your.email@example.com>" \
      version="1.0" \
      description="React Frontend Application Runtime"

# Remove default Nginx configuration and add custom configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy build artifacts from builder stage
COPY --from=builder /home/appuser/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]