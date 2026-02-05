# Use Java 17 (Spring Boot 3 compatible)
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and config
COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml pom.xml

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies (cache layer)
RUN ./mvnw dependency:go-offline

# Copy source
COPY src src

# Build application
RUN ./mvnw clean package -DskipTests

# Expose correct port (matches your logs: 8082)
EXPOSE 8082

# Run the jar
CMD ["java", "-jar", "target/item-service-0.0.1-SNAPSHOT.jar"]
