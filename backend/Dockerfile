# Stage 1: Build the application
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

# Create a non-root user for building
RUN addgroup -S spring && adduser -S spring -G spring

# create Maven local repository  with the correct permissions
RUN mkdir -p /home/spring/.m2/repository && \
    chown -R spring:spring /home/spring/.m2

WORKDIR /build
RUN chown spring:spring /build

USER spring

# Copy only pom.xml first to cache dependencies
COPY --chown=spring:spring pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY --chown=spring:spring src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine@sha256:fcf70ae7ba37872c7d1da875593321c3e90bd9a02c6b4bfde5a1260b08b8f178

# Add non-root user
RUN addgroup -S spring && adduser -S spring -G spring

RUN apk add --no-cache \
    dumb-init=1.2.5-r3 \
    curl=8.11.0-r2

WORKDIR /app

# Copy jar from builder stage
COPY --from=builder --chown=spring:spring /build/target/*.jar app.jar

# Set environment variables
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENV SPRING_PROFILES_ACTIVE="prod"

# Switch to non-root user
USER spring:spring

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Use dumb-init as PID 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Run the application
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]