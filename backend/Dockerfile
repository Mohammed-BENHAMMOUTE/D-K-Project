# Stage 1: Build
# Uses Maven with Eclipse Temurin JDK 17 on Alpine Linux
# SHA256 pinning ensures image consistency and security
# AS builder names this stage for multi-stage build reference
# Alpine base reduces image size
FROM maven:3.9.9-eclipse-temurin-17-alpine@sha256:bff43a9e4b4365b986c8e5050b9e5a5f1b1c6729365beb42c5a5f7cf2009a4e7 AS builder

# Creating a non root user for the build
# Creates system group and user (-S flag)
# Security best practice: avoid running as root
# Spring user will own and run the application
RUN addgroup -S spring && adduser -S spring -G spring



# creating a maven local repository with the correct permissions
# Creates Maven local repository directory
# -p creates parent directories if needed
# Sets correct ownership for Maven cache
# Prevents permission issues during build
# .m2 is the directory where Maven stores dependencies in general
RUN mkdir -p /home/spring/.m2/repository && \
    chown -R spring:spring /home/spring/.m2




#Working directory for the build:
# Sets build context directory
# Ensures spring user owns working directory
# Keeps build artifacts isolated
WORKDIR /build
RUN chown spring:spring /build



#User switch:
# Switches to non-root user
# All subsequent commands run as spring user
# Security best practice
USER spring



# Copying only pom.xml first to cache dependencies
# Copies only pom.xml first (layer optimization)
# Downloads dependencies before code copy
# Leverages Docker layer caching
# --chown ensures correct file ownership
COPY --chown=spring:spring pom.xml .
RUN mvn dependency:go-offline


# Application Build
# Copies only pom.xml first (layer optimization)
# Downloads dependencies before code copy
# Leverages Docker layer caching
# --chown ensures correct file ownership
COPY --chown=spring:spring src ./src
RUN mvn clean package -DskipTests



# Runtime Stage
# Starts new stage for runtime
# Uses JRE only (smaller than JDK)
# Alpine-based for minimal size
# SHA256 pinning for security
FROM eclipse-temurin:17-jre-alpine@sha256:fcf70ae7ba37872c7d1da875593321c3e90bd9a02c6b4bfde5a1260b08b8f178



# Add non-root user
# Creates a dedicated system group and user named 'spring'
# -S flag creates a system account with restricted privileges
# This is a security best practice to avoid running containers as root
# System users have lower privileges and help minimize potential security risks
RUN addgroup -S spring && adduser -S spring -G spring

# Install essential runtime packages
# dumb-init: Provides proper process management and signal handling
# - Handles zombie processes and forwards signals correctly
# curl: Required for health check endpoints
# --no-cache: Reduces image size by not storing APK cache
# Version pinning prevents supply chain attacks and ensures reproducible builds
RUN apk add --no-cache \
    dumb-init=1.2.5-r3 \
    curl=8.11.0-r2

# Set the working directory for the application
# Creates a dedicated directory for the application files
# All subsequent commands will be executed relative to this path
# Isolates application files from system files
WORKDIR /app

# Copy application artifact from builder stage
# Uses multi-stage build pattern to reduce final image size
# --from=builder references the previous build stage
# --chown ensures proper file ownership for security
# Copies the compiled JAR file and renames it to app.jar for consistency
COPY --from=builder --chown=spring:spring /build/target/*.jar app.jar

# Configure JVM and application behavior
# JAVA_OPTS: JVM runtime configuration
# - UseContainerSupport: Enables container-aware memory limits
# - MaxRAMPercentage: Sets heap size to 75% of available memory
# SPRING_PROFILES_ACTIVE: Activates production configuration profile
# These settings optimize container memory usage and application behavior
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENV SPRING_PROFILES_ACTIVE="prod"

# Set runtime user
# Changes from root to spring user for all subsequent operations
# Format user:group ensures both user and group are set
# Critical security measure to limit container privileges
USER spring:spring

# Define network interface
# Documents that the application listens on port 8080
# Required for container orchestration and networking
# Does not actually open the port (requires -p flag at runtime)
EXPOSE 8080

# Container health monitoring
# Checks application health every 30 seconds
# --interval: Time between checks
# --timeout: Maximum time to wait for response
# --start-period: Initial grace period for startup
# --retries: Number of consecutive failures before declaring unhealthy
# Uses Spring Boot Actuator's health endpoint for deep health checking
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Process management configuration
# dumb-init serves as PID 1 (init process)
# Properly handles process signals and zombie process reaping
# Critical for proper container lifecycle management
# -- signals end of dumb-init arguments
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Application startup command
# Uses shell form to allow environment variable expansion
# Executes Java application with configured options
# $JAVA_OPTS expands to the memory and container support settings
# Runs as non-privileged user in a controlled environment
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]