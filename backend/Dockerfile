# Stage 1: Build
# Use a specific version of Maven with Eclipse Temurin JDK 17 on Alpine Linux for a smaller image size
FROM maven:3.9.9-eclipse-temurin-17-alpine@sha256:bff43a9e4b4365b986c8e5050b9e5a5f1b1c6729365beb42c5a5f7cf2009a4e7 AS builder

# Enhanced Metadata Labels for better image documentation and traceability
LABEL maintainer="Mohammed Benhammoute" \
      version="1.0" \
      description="Spring Boot Application" \
      email="mohammedbenhammoute@gmail.com" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.vendor="Mohammed Benhammoute" \
      org.opencontainers.image.title="Spring Boot Backend"

# Create a non-root user for better security and set up Maven repository in a single layer to reduce image size
RUN addgroup -S spring && adduser -S spring -G spring && \
    mkdir -p /home/spring/.m2/repository && \
    chown -R spring:spring /home/spring/.m2 && \
    mkdir -p /build && \
    chown spring:spring /build

# Set the working directory and switch to the non-root user
WORKDIR /build
USER spring

# Copy the Maven project file and download dependencies to leverage Docker cache
COPY --chown=spring:spring pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application, skipping tests to speed up the build process
COPY --chown=spring:spring src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
# Use a specific version of Eclipse Temurin JRE 17 on Alpine Linux for a smaller image size
FROM eclipse-temurin:17-jre-alpine@sha256:fcf70ae7ba37872c7d1da875593321c3e90bd9a02c6b4bfde5a1260b08b8f178

# Update packages to fix vulnerabilities and install a specific version of curl
RUN apk update && \
    apk upgrade curl && \
    apk add --no-cache curl=8.11.1-r0 && \
    rm -rf /var/cache/apk/*

# Create and use a non-root user for better security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

# Copy the built jar file from the builder stage and set the working directory
COPY --from=builder --chown=spring:spring /build/target/*.jar /app/app.jar
WORKDIR /app

# Add a healthcheck to monitor the application status
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Set environment variables for JVM options to optimize memory usage
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:MinRAMPercentage=25.0 -XX:+UseG1GC"

# Expose the application port
EXPOSE 8080

# Define the entry point to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]