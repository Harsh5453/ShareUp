# ===============================
# Build stage
# ===============================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom and download deps first (cache optimization)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# ===============================
# Runtime stage
# ===============================
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/auth-service-0.0.1-SNAPSHOT.jar app.jar

# Render injects PORT automatically
EXPOSE 10000

# Run app
ENTRYPOINT ["java", "-jar", "app.jar"]
