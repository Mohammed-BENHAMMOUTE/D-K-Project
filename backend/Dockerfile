# Stage 1: Build
# Uses Maven with Eclipse Temurin JDK 17 on Alpine Linux
# SHA256 pinning ensures image consistency and security
FROM maven:3.9.9-eclipse-temurin-17-alpine@sha256:bff43a9e4b4365b986c8e5050b9e5a5f1b1c6729365beb42c5a5f7cf2009a4e7 AS builder

# Metadata Labels for better image management
LABEL maintainer="Mohammed Benhammoute" \
      version="1.0" \
      description="Spring Boot Application" \
      email="mohammedbenhammoute@gmail.com"

# Best Practice: Create a non-root user and set up Maven repository with correct permissions
# one layer to minimize image size
RUN addgroup -S spring && adduser -S spring -G spring && \
    mkdir -p /home/spring/.m2/repository && \
    chown -R spring:spring /home/spring/.m2 && \
    mkdir -p /build && \
    chown spring:spring /build

# Set the working directory for the build
WORKDIR /build

# Switch to non-root user to enhance security
USER spring

# Best Practice: Copy only pom.xml first to leverage Docker layer caching for dependencies
COPY --chown=spring:spring pom.xml .
RUN mvn dependency:go-offline

# Best Practice: Copy source code after dependencies to maximize caching efficiency
COPY --chown=spring:spring src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
# Uses JRE with Eclipse Temurin on Alpine Linux for a smaller image size
FROM eclipse-temurin:17-jre-alpine@sha256:fcf70ae7ba37872c7d1da875593321c3e90bd9a02c6b4bfde5a1260b08b8f178

# Metadata Labels for runtime image
LABEL maintainer="Mohammed Benhammoute <mohammedbenhammoute@gmail.com>" \
      version="1.0" \
      description="Spring Boot Application Runtime"

# Best Practice: Create a non-root user and install essential packages in one layer to minimize image size
# single layer for lighter image size
RUN addgroup -S spring && adduser -S spring -G spring && \
    apk add --no-cache dumb-init=1.2.5-r3 curl=8.11.0-r2 && \
    mkdir -p /app && \
    chown spring:spring /app

# Set the working directory for the application
WORKDIR /app

# Best Practice: Use multi-stage build to copy only the necessary artifact, reducing the final image size
COPY --from=builder --chown=spring:spring /build/target/*.jar app.jar

# Best Practice: Configuring JVM and application behavior using environment variables for flexibility and optimization
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0" \
    SPRING_PROFILES_ACTIVE="prod"

# Best Practice: Switch to non-root user to run the application with limited privileges
USER spring:spring

# Best Practice: Document exposed ports and their purpose
EXPOSE 8080

#setting environment variables for database connection, i used these in application.yml as arguments
ENV DB_HOST=postgres-container \
    DB_PORT=5432 \
    DB_NAME=my_database \
    DB_USER=postgres \
    DB_PASSWORD=postgres123


# Best Practice: Implement a HEALTHCHECK to monitor application health and ensure container orchestration can manage it effectively
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Best Practice: Use dumb-init as the ENTRYPOINT for proper signal handling and process management
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Best Practice: Use CMD to define default command with environment variable expansion for flexibility
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
# please check the .dockerignore file where I exclude unnecessary files from the context